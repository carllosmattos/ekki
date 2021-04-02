<template>
  <div class="container">
    <div class="row mt-3">
      <div class="col">
        <p class="md-title">Histórico de transferencias</p>
        <md-empty-state 
          v-if="transferencias.length === 0"
          md-icon="leaderboard"
          md-label="Está é a sua primeira transferência! Vamos lá?"
          md-description="Clique no botão abaixo para fazer a sua primeira transferencia.">
          <md-button class="md-primary md-raised" @click="openDialog('Realizar uma transferencia')">
            Transferir
          </md-button>
        </md-empty-state>
        <md-table md-card  v-if="transferencias.length > 0">
          <md-table-toolbar>
            <h1 class="md-title" style="flex: 1">Tranferencias</h1>
            <md-button class="md-primary md-raised" @click="openDialog('Realizar uma transferencia')">
              Cadastrar
            </md-button>
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
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>{{showDialogTitle}}</md-dialog-title>
      <div class="col">
        <md-field :class="$v.transferencia.valor.$error ? 'md-invalid': ''">
          <label>Valor *</label>
          <md-input v-model="$v.transferencia.valor.$model" type="number"></md-input>
          <span class="md-error" v-if="!$v.transferencia.valor.required">Valor e Requirido </span>
          <span class="md-error" v-if="!$v.transferencia.valor.minValue">Valor necessario ser maior que 0 </span>
        </md-field>
        <md-field :class="$v.transferencia.contato.$error ? 'md-invalid': ''">
          <label for="contato">Contato</label>
          <md-select v-model="$v.transferencia.contato.$model" id="contato">
            <md-option v-for="cont in contatos" :key="cont.id" :value="cont.id">
              {{cont.nome}}
            </md-option>
          </md-select>
          <span class="md-error" v-if="!$v.transferencia.contato.required">Valor e Requirido </span>
        </md-field>
      </div>
      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog()">Fechar</md-button>
        <md-button class="md-primary" type="submit" @click="submit()" :disabled="$v.$invalid">Salvar</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="showSnackbarSucess" md-persistent>
      <span>Tranferecia realizada com sucesso</span>
    </md-snackbar>
  </div>
</template>

<script>
import MainService from '../services/main.service'
import { required, minValue } from 'vuelidate/lib/validators'

export default {
  name: "Tranferecia",
  data: ()=> ({
    transferencias: [],
    contatos: [],
    transferencia:{
      contato: '',
      valor: 0
    },
    showDialog: false,
    showDialogTitle: '',
    showSnackbarSucess: false
  }),
  validations:{
    transferencia:{
      contato: {
        required
      },
      valor: {
        required,
        minValue: minValue(1)
      }
    },
  },
  mounted(){
    this.getData()
  },
  methods:{
    getData(){
      MainService.getGenreric('/transferencia').then((result)=>{
        this.transferencias = result.data
        console.log(this.transferencias)
      }).catch((error)=>{
        this.$swal.fire(
          'Lamentamos por isso',
          error.response.data[0].message,
          'info'
        )
      })
    },
    openDialog(title){
      MainService.getGenreric('/contato').then((result)=>{
        if(result.data.length > 0){
          this.contatos = result.data
          this.showDialogTitle = title
          this.showDialog = true
        }else{
          this.$swal.fire(
            'Lista de Contatos!',
            'Você ainda não possui nenhum contato para transferir. Vamos cadastrar um agora?.',
            'info'
          ).then(()=>{
            this.$router.push("/contato")
          })
        }
      }).catch((error)=>{
        this.$swal.fire(
          'Lamentamos por isso',
          error.response.data[0].message,
          'info'
        )
      })
    },
    closeDialog(){
      this.showDialog = false
      this.$v.$reset()
    },
    submit(){
      MainService.getGenreric('/system/usuario').then((result)=>{
        const usuario = result.data
        const data = this.transferencia
        if(data.valor <= parseInt(usuario.conta.saldo + usuario.conta.limite)){
          if(data.valor > usuario.conta.saldo){
            // Caso o valor da transferencia utrapasse o saldo do usuario
            this.$swal.fire({
              title: 'você tem certeza ?',
              text: "Será utilizado seu saldo limite para cobrir sua transferencia",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sim, continuar!'
            }).then((result) => {
              if (result.isConfirmed) {
                MainService.postGenreric('/transferencia', data).then(async() => {
                  await MainService.getUsuarioIntial()
                  this.$v.$reset()
                  this.getData()
                  this.showDialog = false
                  this.showSnackbarSucess = true
                }).catch((error)=>{
                  this.showDialog = false
                  this.$swal.fire(
                    error.response.data[0].name,
                    error.response.data[0].message,
                    'info'
                  )
                })
              }
            })
          }else{
            // Transferencia normal
            MainService.postGenreric('/transferencia', data).then(async()=>{
              await MainService.getUsuarioIntial()
              this.$v.$reset()
              this.getData()
              this.showDialog = false
              this.showSnackbarSucess = true
            }).catch((error)=>{
              this.showDialog = false
              this.$swal.fire(
                error.response.data[0].nome,
                error.response.data[0].message,
                'info'
              )
            })
          }
        }else {
          // Caso usuário não tenha mais limite ou saldo para cobrir a transferencia
          this.$swal.fire(
            'Atenção!',
            'Usuário não possui saldo suficiente para realiza a transferencia',
            'warning'
          )
        }
      })
    }
  }
}
</script>