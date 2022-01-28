const fs = require('fs')
const axios = require('axios')

class Searches {
    history = []
    dbPath = './db/searchingHistory.json'

    constructor(){
        this.readDB
    }

    get capitalizeHistory(){    
        let newHistoryCap = []
        let newStr = ''
        this.history.forEach( place => {
            if (place.indexOf( ' ' ) !== -1 ) {
                place.split( ' ' ).forEach( word => {
                    newStr += word.charAt().toUpperCase() + word.slice(1) + ' '
                })
                newHistoryCap.push(newStr)
                newStr = ''
    
            } else if(place.length < 3){
                newHistoryCap.push(place.toUpperCase()) 
    
            } else{
                newHistoryCap.push(place.charAt(0).toUpperCase() + place.slice(1))
            }
        });
        return newHistoryCap
    }

    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'lenguaje': 'es'
        }
    }

    get paramsOpenWeather(){
        return{
            'access_token': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async city( place = '' ){
        // HTTP petition using npm axios
        try{
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/`,
                params: this.paramsMapbox
            })

            const resp = await instance.get(`${ place }.json`)
            return resp.data.features.map( place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1]
            }))

        } catch ( error ) {

            return []
        }
    }

    async weather ( lat , lng ){

        try{
            // Instance axios
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/`,
                params: {...this.paramsOpenWeather, lat, lng}
            })
        
            // resp.data
            const resp = await instance.get('weather')
            const { weather, main } = resp.data
            return {
                desc: weather[0].description,
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max
            }

        }catch(err) {
            console.log(err)
        }
    }

    historyApp( place = '' ){
        // Prevent duplicates
        if(this.history.includes( place.toLowerCase() ) ){
            return
        }

        this.history.unshift( place )
        
        // Make new DB
        this.saveDB()
    }

    saveDB(){
        const payload = {
            history: this.history,
        }
        fs.writeFile(this.dbPath, JSON.stringify( payload ))
    }

    readDB(){
        if(!fs.existsSync(this.dbPath)) return

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'})
        data = JSON.parse(info)
        return data.history
    }
}


module.exports = Searches