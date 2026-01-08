import chalk from 'chalk'
import { clearAuth, isAuthenticated } from '../config.js'

export async function logout() {
  if (!isAuthenticated()) {
    console.log(chalk.yellow('\nNot logged in.\n'))
    return
  }

  clearAuth()
  console.log(chalk.green('\n✓ Logged out successfully.\n'))
}
