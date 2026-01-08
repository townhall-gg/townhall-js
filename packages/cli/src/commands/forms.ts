import chalk from 'chalk'
import ora from 'ora'
import prompts from 'prompts'
import { isAuthenticated, config } from '../config.js'
import { listForms, createForm, getForm, getCurrentUser } from '../api.js'

export async function formsList() {
  if (!isAuthenticated()) {
    console.log(chalk.yellow('\nNot logged in. Run `townhall login` first.\n'))
    return
  }

  const spinner = ora('Fetching forms...').start()

  try {
    const workspaceId = config.get('workspaceId')
    const forms = await listForms(workspaceId)
    spinner.stop()

    if (forms.length === 0) {
      console.log(chalk.yellow('\nNo forms found.'))
      console.log(chalk.dim('Create one with `townhall forms create` or at https://townhall.gg\n'))
      return
    }

    console.log(chalk.bold(`\n📋 Forms (${forms.length})\n`))

    forms.forEach((form) => {
      const status = form.status === 'active' 
        ? chalk.green('● active') 
        : chalk.yellow('○ inactive')
      
      console.log(`  ${chalk.bold(form.name)}`)
      console.log(`  ${chalk.dim('ID:')} ${form.id}`)
      console.log(`  ${chalk.dim('Status:')} ${status}  ${chalk.dim('Submissions:')} ${form.submissionCount}`)
      console.log()
    })
  } catch (error) {
    spinner.fail(chalk.red('Failed to fetch forms'))
    if (error instanceof Error) {
      console.log(chalk.red(`\nError: ${error.message}\n`))
    }
  }
}

export async function formsCreate() {
  if (!isAuthenticated()) {
    console.log(chalk.yellow('\nNot logged in. Run `townhall login` first.\n'))
    return
  }

  console.log(chalk.bold('\n📝 Create New Form\n'))

  let workspaceId = config.get('workspaceId')

  // If no default workspace, let user choose
  if (!workspaceId) {
    const { workspaces } = await getCurrentUser()
    if (workspaces.length === 0) {
      console.log(chalk.red('No workspaces available. Create one at https://townhall.gg\n'))
      return
    }
    if (workspaces.length === 1) {
      workspaceId = workspaces[0].id
    } else {
      const { workspace } = await prompts({
        type: 'select',
        name: 'workspace',
        message: 'Select workspace:',
        choices: workspaces.map((w) => ({
          title: w.name,
          value: w.id,
        })),
      })
      workspaceId = workspace
    }
  }

  if (!workspaceId) {
    console.log(chalk.yellow('\nCancelled.\n'))
    return
  }

  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: 'Form name:',
    validate: (v) => v.length > 0 || 'Name is required',
  })

  if (!name) {
    console.log(chalk.yellow('\nCancelled.\n'))
    return
  }

  const spinner = ora('Creating form...').start()

  try {
    const form = await createForm({ name, workspaceId })
    spinner.succeed(chalk.green('Form created!'))

    console.log(`\n${chalk.dim('Form ID:')} ${chalk.bold(form.id)}`)
    console.log(`\n${chalk.dim('Use in your code:')}`)
    console.log(chalk.cyan(`\n  import { useTownHallForm } from '@townhall-gg/react'\n`))
    console.log(chalk.cyan(`  const form = useTownHallForm('${form.id}')\n`))
  } catch (error) {
    spinner.fail(chalk.red('Failed to create form'))
    if (error instanceof Error) {
      console.log(chalk.red(`\nError: ${error.message}\n`))
    }
  }
}

export async function formsGet(formId: string) {
  if (!isAuthenticated()) {
    console.log(chalk.yellow('\nNot logged in. Run `townhall login` first.\n'))
    return
  }

  const spinner = ora('Fetching form...').start()

  try {
    const form = await getForm(formId)
    spinner.stop()

    const status = form.status === 'active' 
      ? chalk.green('● active') 
      : chalk.yellow('○ inactive')

    console.log(chalk.bold(`\n📋 ${form.name}\n`))
    console.log(`${chalk.dim('ID:')}          ${form.id}`)
    console.log(`${chalk.dim('Status:')}      ${status}`)
    console.log(`${chalk.dim('Submissions:')} ${form.submissionCount}`)
    console.log(`${chalk.dim('Created:')}     ${new Date(form.createdAt).toLocaleDateString()}`)
    console.log()
  } catch (error) {
    spinner.fail(chalk.red('Failed to fetch form'))
    if (error instanceof Error) {
      console.log(chalk.red(`\nError: ${error.message}\n`))
    }
  }
}
