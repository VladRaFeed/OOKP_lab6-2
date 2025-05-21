import fs from 'fs'
import chalk from 'chalk'
import figlet from 'figlet'
import cliProgress from 'cli-progress'

function printHeader() {
  console.log(
    chalk.cyan(
      figlet.textSync('Text Analyzer', {
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  )
}

function compareWords(data1, data2, label = 'Зіставлення') {
  const splitData1 = data1.split(' ')
  const splitData2 = data2.split(' ')
  const size = Math.max(splitData1.length, splitData2.length)

  let truePercent = 0

  // Прогрес-бар
  const progressBar = new cliProgress.SingleBar({
    format: `${label} |` + chalk.cyan('{bar}') + '| {percentage}% || {value}/{total}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  })
  progressBar.start(size, 0)

  for (let i = 0; i < size; i++) {
    if (splitData1[i] === splitData2[i]) {
      truePercent++
    }
    progressBar.update(i + 1)
  }

  progressBar.stop()

  return {
    total: size,
    matchPercent: (truePercent / size) * 100,
  }
}

async function asyncReadFilesAndCheck() {
  const time0 = performance.now()
  const [data1, data2] = await Promise.all([
    fs.promises.readFile('./test.txt', 'utf8'),
    fs.promises.readFile('./test2.docx', 'utf8'),
  ])

  const result = compareWords(data1, data2, 'Async аналіз     ')
  const time1 = performance.now()

  return {
    time: time1 - time0,
    ...result,
  }
}

function syncReadFilesAndCheck() {
  const time0 = performance.now()
  const data1 = fs.readFileSync('./test.txt', 'utf8')
  const data2 = fs.readFileSync('./test2.docx', 'utf8')

  const result = compareWords(data1, data2, 'Sync аналіз      ')
  const time1 = performance.now()

  return {
    time: time1 - time0,
    ...result,
  }
}

async function main() {
  printHeader()

  console.log(chalk.blue('\n▶ Запускаємо async аналіз...'))
  const asyncResult = await asyncReadFilesAndCheck()
  console.log(
    chalk.green(`   Час виконання: ${asyncResult.time.toFixed(2)} мс`)
  )
  console.log(
    chalk.green(`   Відсоток співпадіння: ${asyncResult.matchPercent.toFixed(2)}%`)
  )

  console.log(chalk.blue('\n▶ Запускаємо sync аналіз...'))
  const syncResult = syncReadFilesAndCheck()
  console.log(
    chalk.green(`   Час виконання: ${syncResult.time.toFixed(2)} мс`)
  )
  console.log(
    chalk.green(`   Відсоток співпадіння: ${syncResult.matchPercent.toFixed(2)}%`)
  )

  console.log(chalk.yellow('\n✔ Аналіз завершено.'))
}

main()
