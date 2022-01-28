const inquirer = require('inquirer')
require('colors')

const menuOpts = [{
    type: 'list',
    name: 'options',
    message: '¿Qué desea hacer?',
    choices: [
        {
            value: 1,
            name: `${'1.'.green} Buscar ciudad/país`
        },
        {
            value: 2,
            name: `${'2.'.green} Historial`
        },
        {
            value: 0,
            name: `${'3.'.green} Salir`
        }
    ]
}]

const inquirerMenu = async() => {
    console.clear()
    console.log('==========================='.green)
    console.log('    Aplicación de Clima    '.white)
    console.log('===========================\n'.green)

    const {options} = await inquirer.prompt(menuOpts)
    return options
}

const pause = async() => {
    const question = [{
        type: 'input',
        name: 'enter',
        message: `Presiona ${'"enter"'.green} para continuar`
    }]
    console.log('\n')
    await inquirer.prompt(question)
}

const readInput = async(message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ){
                if(value.length === 0){
                    return 'Por favor ingrese un valor'.red
                }
                return true
            }
        }
    ];
    const {desc}  = await inquirer.prompt(question)
    return desc
}

const listingPlaces = async( places = [] ) => {

    const choices = places.map( (place, i) => {

        const idx = `${i + 1}.`.green
        return {
            value: place.id,
            name: `${idx} ${place.name}`
        }
    })
    choices.unshift({
        value: '0',
        name: '0. Cancelar'.red
    })

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccionar:',
            choices
        }
    ]
    const {id} = await inquirer.prompt(questions)
    return id
}


const completeListTasks = async(tasks) => {

    /*     {
        value: task.id,
        desc: `description of the task`
    }, */
    const choices = tasks.map( (task, i) => {

        const idx = `${i + 1}.`.green
        return {
            value: task.id,
            name: `${idx} ${task.desc}`,
            checked: (task.completedOn) ? true : false
        }
    })

    const questions = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices
        }
    ]
    const {ids} = await inquirer.prompt(questions)
    return ids
}



const confirmation = async(message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]
    const {ok} = await inquirer.prompt(question)
    return ok
}



module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listingPlaces,
    confirmation,
    completeListTasks
}
