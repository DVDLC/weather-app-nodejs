require('dotenv').config()
const { readInput, inquirerMenu, pause, listingPlaces } = require("./helpers/menuOpts");
const Searches = require("./models/searches");


const main = async() => {

    let opt
    const searches = new Searches()

    do{

        opt = await inquirerMenu()
        
        switch( opt ){
            case 1:
                // Return the message
                const userInput = await readInput( 'Ciudad: ' ) 

                // Search about the place/city
                const places =  await searches.city( userInput )

                // Select the match
                const id = await listingPlaces(places)
                if(id === '0') continue

                // save DB 
                const selPlace = places.find( p => p.id === id)
                searches.historyApp( selPlace.name )

                // Weather
                const weather = await searches.weather(selPlace.lat, selPlace.lng)
                console.log(weather)
                
                // Return weather results
                console.log('\n Informacioón de la ciudad/lugar\n'.green)
                console.log('Ciudad: ', selPlace.name.green )
                console.log('Lat: ', selPlace.lat )
                console.log('Lng: ', selPlace.lng)
                console.log('Clima: ', weather.desc.green )
                console.log('Temperatura: ', weather.temp)
                console.log('Mínima: ', weather.min)
                console.log('Máxima: ', weather.max)
                break
            case 2:
                searches.capitalizeHistory.forEach( (place, i) => {
                    const idx = `${i + 1}.`.green
                    console.log(idx, place);
                })
                break
        }

        if( opt !== 0 ) await pause()

    }while(opt !== 0)
}

main()