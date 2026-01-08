import chalk from 'chalk'
import ora from 'ora'
import prompts from 'prompts'
import { isAuthenticated } from '../config.js'
import { listForms, listSubmissions } from '../api.js'

export async function submissionsList(formId?: string, options?: { limit?: number }) {
  if (!isAuthenticated()) {
    console.log(chalk.yellow('\nNot logged in. Run `townhall login` first.\n'))
    return
  }

  // If no formId provided, let user select
  if (!formId) {
    const forms = await listForms()
    if (forms.length === 0) {
      console.log(chalk.yellow('\nNo forms found.\n'))
      return
    }

    const { selectedForm } = await prompts({
      type: 'select',
      name: 'selectedForm',
      message: 'Select form:',
      choices: forms.map((f) => ({
        title: `${f.name} ${chalk.dim(`(${f.submissionCount} submissions)`)}`,
        value: f.id,
      })),
    })

    if (!selectedForm) {
      console.log(chalk.yellow('\nCancelled.\n'))
      return
    }

    formId = selectedForm
  }

  const spinner = ora('Fetching submissions...').start()

  try {
    const limit = options?.limit ?? 10
    const submissions = await listSubmissions(formId, limit)
    spinner.stop()

    if (submissions.length === 0) {
      console.log(chalk.yellow('\nNo submissions yet.\n'))
      return
    }

    console.log(chalk.bold(`\n📬 Recent Submissions (${submissions.length})\n`))

    submissions.forEach((sub, i) => {
      console.log(chalk.dim(`─── ${i + 1} ───────────────────────────────`))
      console.log(`${chalk.dim('ID:')}   ${sub.id}`)
      console.log(`${chalk.dim('Date:')} ${new Date(sub.createdAt).toLocaleString()}`)
      console.log(`${chalk.dim('Data:')}`)
      
      Object.entries(sub.data).forEach(([key, value]) => {
        const displayValue = typeof value === 'string' && value.length > 50
          ? value.slice(0, 50) + '...'
          : value
        console.log(`  ${chalk.cyan(key)}: ${displayValue}`)
      })
      console.log()
    })
  } catch (error) {
    spinner.fail(chalk.red('Failed to fetch submissions'))
    if (error instanceof Error) {
      console.log(chalk.red(`\nError: ${error.message}\n`))
    }
  }
}
