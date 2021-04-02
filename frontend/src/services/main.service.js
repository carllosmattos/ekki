import axios from 'axios'
import env from '../env'

class MainService{

    baseUrl = env.BASE_URL

    getUsuarioIntial(){
        return new Promise((resolve, reject) =>{
            axios.get(`${this.baseUrl}/system/usuario`).then((response) =>{
                this.setUsuario(response.data.usuario)
                this.setConta(response.data.conta)
                resolve(response.data)
            }).catch(reject)
        })
    }

    resetUsuario(){
        return new Promise((resolve, reject) =>{
            axios.get(`${this.baseUrl}/system/reload`).then(async(response) =>{
                try {
                    await this.getUsuarioIntial()
                    resolve(response.data)
                } catch (error) {
                    console.log(error)
                    reject(error)
                }
            }).catch(reject)
        })
    }

    getGenreric(base){
        return axios.get(`${this.baseUrl}${base}`)
    }

    postGenreric(base, data){
        return axios.post(`${this.baseUrl}${base}`, data)  
    }

    putGenreric(base, data){
        return axios.put(`${this.baseUrl}${base}`, data)  
    }

    delGenreric(base){
        return axios.delete(`${this.baseUrl}${base}`) 
    }

    getUsuario(){
        return JSON.parse(window.localStorage.getItem('usuario'))
    }

    setUsuario(usuario){
        window.localStorage.setItem('usuario', JSON.stringify(usuario))
    }
    
    getConta(){
        return JSON.parse(window.localStorage.getItem('conta'))
    }

    setConta(conta){
        window.localStorage.setItem('conta', JSON.stringify(conta))
    }
}

export default new MainService();