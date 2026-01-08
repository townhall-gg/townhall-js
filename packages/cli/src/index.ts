import { Command } from 'commander'
import chalk from 'chalk'
import { login } from './commands/login.js'
import { logout } from './commands/logout.js'
import { whoami } from './commands/whoami.js'
import { formsList, formsCreate, formsGet } from './commands/forms.js'
import { submissionsList } from './commands/submissions.js'
import { init } from './commands/init.js'

const program = new Command()

program
  .name('townhall')
  .description('CLI for TownHall form management')
  .version('0.1.0')

// Auth commands
program
  .command('login')
  .description('Authenticate with your TownHall API key')
  .action(login)

program
  .command('logout')
  .description('Log out and clear stored credentials')
  .action(logout)

program
  .command('whoami')
  .description('Show current authenticated user')
  .action(whoami)

// Forms commands
const forms = program
  .command('forms')
  .description('Manage your forms')

forms
  .command('list')
  .alias('ls')
  .description('List all forms')
  .action(formsList)

forms
  .command('create')
  .description('Create a new form')
  .action(formsCreate)

forms
  .command('get <formId>')
  .description('Get details about a form')
  .action(formsGet)

// Submissions command
program
  .command('submissions [formId]')
  .alias('subs')
  .description('List recent submissions')
  .option('-l, --limit <number>', 'Number of submissions to show', '10')
  .action((formId, options) => {
    submissionsList(formId, { limit: parseInt(options.limit, 10) })
  })

// Init command
program
  .command('init')
  .description('Initialize TownHall in your project')
  .action(init)

// Custom help
program.addHelpText('after', `
${chalk.bold('Examples:')}
  ${chalk.dim('# Login with your API key')}
  $ townhall login

  ${chalk.dim('# List all your forms')}
  $ townhall forms list

  ${chalk.dim('# Create a new form')}
  $ townhall forms create

  ${chalk.dim('# View recent submissions')}
  $ townhall submissions

  ${chalk.dim('# Initialize in a project')}
  $ townhall init

${chalk.dim('Get your API key at:')} ${chalk.cyan('https://townhall.gg/settings/api')}
`)

program.parse()
