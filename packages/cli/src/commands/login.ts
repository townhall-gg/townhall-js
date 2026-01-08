import chalk from 'chalk'
import ora from 'ora'
import prompts from 'prompts'
import { setApiKey, setWorkspace } from '../config.js'
import { getCurrentUser } from '../api.js'

export async function login() {
  console.log(chalk.bold('\n🏛️  TownHall CLI Login\n'))
  console.log(chalk.dim('Get your API key from: https://townhall.gg/settings/api\n'))

  const response = await prompts({
    type: 'password',
    name: 'apiKey',
    message: 'Enter your API key:',
  })

  if (!response.apiKey) {
    console.log(chalk.yellow('\nLogin cancelled.'))
    return
  }

  // Temporarily set the key to test it
  setApiKey(response.apiKey)

  const spinner = ora('Verifying API key...').start()

  try {
    const { user, workspaces } = await getCurrentUser()
    spinner.succeed(chalk.green('Authenticated!'))

    console.log(`\n${chalk.dim('Logged in as:')} ${chalk.bold(user.email)}`)

    if (workspaces.length === 1) {
      setWorkspace(workspaces[0].id, workspaces[0].name)
      console.log(`${chalk.dim('Workspace:')} ${chalk.bold(workspaces[0].name)}`)
    } else if (workspaces.length > 1) {
      const { workspace } = await prompts({
        type: 'select',
        name: 'workspace',
        message: 'Select default workspace:',
        choices: workspaces.map((w) => ({
          title: w.name,
          value: w,
        })),
      })

      if (workspace) {
        setWorkspace(workspace.id, workspace.name)
        console.log(`${chalk.dim('Workspace:')} ${chalk.bold(workspace.name)}`)
      }
    }

    console.log(chalk.green('\n✓ Ready to use TownHall CLI!\n'))
  } catch (error) {
    spinner.fail(chalk.red('Authentication failed'))
    setApiKey('') // Clear invalid key
    if (error instanceof Error) {
      console.log(chalk.red(`\nError: ${error.message}`))
    }
    console.log(chalk.dim('\nMake sure your API key is correct.'))
  }
}
