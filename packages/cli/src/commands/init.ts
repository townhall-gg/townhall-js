import chalk from 'chalk'
import prompts from 'prompts'
import { writeFileSync, existsSync } from 'fs'
import { isAuthenticated } from '../config.js'
import { listForms } from '../api.js'

export async function init() {
  console.log(chalk.bold('\n🏛️  Initialize TownHall\n'))

  // Check if already initialized
  if (existsSync('.townhallrc') || existsSync('townhall.config.js')) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'TownHall config already exists. Overwrite?',
      initial: false,
    })

    if (!overwrite) {
      console.log(chalk.yellow('\nCancelled.\n'))
      return
    }
  }

  let formId: string | undefined

  // If logged in, offer to select a form
  if (isAuthenticated()) {
    const { selectForm } = await prompts({
      type: 'confirm',
      name: 'selectForm',
      message: 'Select an existing form?',
      initial: true,
    })

    if (selectForm) {
      const forms = await listForms()
      if (forms.length > 0) {
        const { selectedForm } = await prompts({
          type: 'select',
          name: 'selectedForm',
          message: 'Choose form:',
          choices: forms.map((f) => ({
            title: f.name,
            value: f.id,
          })),
        })
        formId = selectedForm
      }
    }
  }

  if (!formId) {
    const { manualId } = await prompts({
      type: 'text',
      name: 'manualId',
      message: 'Enter form ID (or leave empty):',
    })
    formId = manualId || undefined
  }

  // Create config file
  const config = {
    formId: formId || 'YOUR_FORM_ID',
  }

  writeFileSync('.townhallrc', JSON.stringify(config, null, 2))

  console.log(chalk.green('\n✓ Created .townhallrc'))

  if (!formId || formId === 'YOUR_FORM_ID') {
    console.log(chalk.dim('\nReplace YOUR_FORM_ID with your actual form ID.'))
    console.log(chalk.dim('Find it at https://townhall.gg or run `townhall forms list`'))
  }

  console.log(chalk.dim('\nNext steps:'))
  console.log(chalk.cyan('  npm install @townhall-gg/react'))
  console.log()
}
