<template>
    <div class="container mt-3">
        <div class="row justify-content-center mb-3">
            <div class="col">
                <md-card>
                    <md-card-header>
                        <div class="md-title md-display-1" style="color: #8a05be; font-weight: bolder;">Saldo disponivel</div>
                    </md-card-header>
                    <md-card-content>
                        <h3 class="md-subheading" style="color: green; font-weight: bold">R$ {{conta.saldo}}</h3>
                    </md-card-content>
                </md-card>
                
            </div>
            <div class="col">
                <md-card>
                    <md-card-header>
                        <div class="md-title md-display-1" style="color: #8a05be; font-weight: bolder;">Saldo Limite</div>
                    </md-card-header>
                    <md-card-content>
                        <h3 class="md-subheading" style="font-weight: bold">R$ {{conta.limite}}</h3>
                    </md-card-content>
                </md-card>
            </div>
        </div>
        <md-divider></md-divider>
        <div class="row mt-3">
            <div class="col">
                <p class="md-title">Ùltimas tranferencias</p>
                <md-empty-state 
                    v-if="transferencias.length === 0"
                    md-icon="swap_horiz"
                    md-label="Faça sua primeira transferencia."
                    md-description="Clique no botão abaixo para fazer a sua primeira transferencia.">
                    <router-link to="/transferencia">
                        <md-button class="md-primary md-raised">Tranferecia</md-button>
                    </router-link>
                </md-empty-state>
                <md-table md-card v-if="transferencias.length > 0">
                    <md-table-toolbar>
                        <h1 class="md-title" style="flex: 1">Tranferencias</h1>
                    </md-table-toolbar>

                    <md-table-row>
                        <md-table-head md-numeric>ID</md-table-head>
                        <md-table-head>Nome</md-table-head>
                        <md-table-head>Valor</md-table-head>
                        <md-table-head>Status</md-table-head>
                        <md-table-head>Descrição</md-table-head>
                        <md-table-head>Data</md-table-head>
                    </md-table-row>

                    <md-table-row v-for="(tran, i) in transferencias" :key="tran.id">
                        <md-table-cell md-numeric>{{i+1}}</md-table-cell>
                        <md-table-cell>{{tran.contato.nome}}</md-table-cell>
                        <md-table-cell>R$ {{tran.transferencia.valor}}</md-table-cell>
                        <md-table-cell>{{tran.transferencia.status}}</md-table-cell>
                        <md-table-cell>{{tran.transferencia.descricao}}</md-table-cell>
                        <md-table-cell>{{tran.transferencia.createdAt | date}}</md-table-cell>
                    </md-table-row>
                </md-table>
            </div>
        </div>
    </div>
</template>

<script>
import MainService from '../services/main.service'

export default {
    name: "HomePage",
    data(){
        return {
            transferencias: [],
            contatos: [],
            showDialogTranferencias: false,
            tranferencia: {
                valor: 0,
                contato: ""
            }
        }
    },
    computed: {
        usuario: ()=>{
            return MainService.getUsuario()
        },
        conta: ()=>{
            return MainService.getConta()
        },
    },
    mounted(){
        MainService.getGenreric('/transferencia').then((result)=>{
            this.transferencias = result.data
        })
    }
}
</script>