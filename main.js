import fs from 'fs'

async function syncReadFilesAndCheck() {
    const time0 = performance.now()
    const data1 = await fs.promises.readFile('./test.txt', 'utf8')
    const data2 = await fs.promises.readFile('./test2.txt', 'utf8')

    const splitData1 = data1.split(' ')
    const splitData2 = data2.split(' ')

    const size = splitData1.length > splitData2.length ? splitData1.length : splitData2.length

    const percent1 = (splitData1.length / size) * 100
    const percent2 = (splitData2.length / size) * 100

    let truePercent = 0;

    for (let i = 0; i < size; i++) {
        if(splitData1[i] === splitData2[i]) {
            truePercent++
        }
    }

    const time1 = performance.now()
    console.log("sync time: ", time1 - time0)
    console.log("true percent: ", ((truePercent / size) * 100))
}

async function asyncReadFilesAndCheck() {
    const time0 = performance.now()
    const [data1, data2] = await Promise.all([
        fs.promises.readFile('./test.txt', 'utf8'),
        fs.promises.readFile('./test2.txt', 'utf8')
    ])

    const splitData1 = data1.split(' ')
    const splitData2 = data2.split(' ')

    const size = splitData1.length > splitData2.length ? splitData1.length : splitData2.length
    
    const percent1 = (splitData1.length / size) * 100
    const percent2 = (splitData2.length / size) * 100
    
    let truePercent = 0;
    
    for (let i = 0; i < size; i++) {
        if(splitData1[i] === splitData2[i]) {
            truePercent++
        }
    
    }

    const time1 = performance.now()
    console.log("async time: ", time1 - time0)
    console.log("true percent: ", ((truePercent / size) * 100))
}

syncReadFilesAndCheck()
asyncReadFilesAndCheck()