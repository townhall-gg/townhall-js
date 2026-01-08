import chalk from 'chalk'
import ora from 'ora'
import { isAuthenticated, config } from '../config.js'
import { getCurrentUser } from '../api.js'

export async function whoami() {
  if (!isAuthenticated()) {
    console.log(chalk.yellow('\nNot logged in. Run `townhall login` to authenticate.\n'))
    return
  }

  const spinner = ora('Fetching user info...').start()

  try {
    const { user, workspaces } = await getCurrentUser()
    spinner.stop()

    console.log(chalk.bold('\n🏛️  TownHall Account\n'))
    console.log(`${chalk.dim('Email:')}     ${user.email}`)
    if (user.name) {
      console.log(`${chalk.dim('Name:')}      ${user.name}`)
    }
    console.log(`${chalk.dim('User ID:')}   ${chalk.dim(user.id)}`)

    const currentWorkspace = config.get('workspaceName')
    if (currentWorkspace) {
      console.log(`\n${chalk.dim('Default Workspace:')} ${chalk.bold(currentWorkspace)}`)
    }

    if (workspaces.length > 0) {
      console.log(`\n${chalk.dim('Available Workspaces:')}`)
      workspaces.forEach((w) => {
        const isCurrent = w.name === currentWorkspace
        console.log(`  ${isCurrent ? chalk.green('●') : chalk.dim('○')} ${w.name} ${chalk.dim(`(${w.slug})`)}`)
      })
    }

    console.log()
  } catch (error) {
    spinner.fail(chalk.red('Failed to fetch user info'))
    if (error instanceof Error) {
      console.log(chalk.red(`\nError: ${error.message}\n`))
    }
  }
}
