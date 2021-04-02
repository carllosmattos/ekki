<template>
  <div class="container">
    <div class="row mt-3">
      <div class="col">
        <p class="md-title">Lista de contatos</p>
        <md-empty-state 
          v-if="contatos.length === 0"
          md-icon="list"
          md-label="Cadastre seu primeiro contato. É bem rápido!"
          md-description="Clique no botão abaixo para cadastrar seus contatos.">
          <md-button class="md-primary md-raised" @click="openDialog('Cadastre um Novo contato')">
            Cadastrar
          </md-button>
        </md-empty-state>
        <md-table md-card  v-if="contatos.length > 0">
          <md-table-toolbar>
            <h1 class="md-title" style="flex: 1">Contatos</h1>
            <md-button class="md-primary md-raised" @click="openDialog('Cadastre um Novo contato.')">
              Cadastrar
            </md-button>
          </md-table-toolbar>

          <md-table-row>
            <md-table-head md-numeric>ID</md-table-head>
            <md-table-head>Nome</md-table-head>
            <md-table-head>Ação</md-table-head>
          </md-table-row>

          <md-table-row v-for="(cont, i) in contatos" :key="cont.id">
            <md-table-cell md-numeric>{{i+1}}</md-table-cell>
            <md-table-cell>{{cont.nome}}</md-table-cell>
            <md-table-cell>
              <md-button id="editar" class="md-icon-button md-primary" @click="openDialog('Editar contato ' + cont.nome, cont)">
                <md-tooltip md-direction="top">Editar Contato {{cont.nome}}</md-tooltip>
                <md-icon>create</md-icon>
              </md-button>
              <md-button id="deletar" class="md-icon-button md-accent" @click="remove(cont)">
                <md-tooltip md-direction="top">Deletar Contato {{cont.nome}}</md-tooltip>
                <md-icon>delete</md-icon>
              </md-button>
            </md-table-cell>
          </md-table-row>
        </md-table>
      </div>
    </div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>{{showDialogTitle}}</md-dialog-title>
      <div class="col">
        <md-field :class="$v.contato.nome.$error ? 'md-invalid': ''">
          <label>Nome *</label>
          <md-input v-model="$v.contato.nome.$model" maxlength="60"></md-input>
          <span class="md-error" v-if="!$v.contato.nome.required">Nome e Requirido </span>
        </md-field>
        <md-field :class="$v.contato.cpf.$error ? 'md-invalid': ''">
          <label>Cpf *</label>
          <md-input v-model="$v.contato.cpf.$model" maxlength="11"></md-input>
          <span class="md-error" v-if="!$v.contato.cpf.required">CPF e Requirido </span>
          <span class="md-error" v-if="
          !$v.contato.cpf.minLength || 
          !$v.contato.cpf.maxLength">
            CPF e necessina ter 11 caracteres
          </span>
        </md-field>
        <md-field :class="$v.contato.telefone.$error ? 'md-invalid': ''">
          <label>Telefone *</label>
          <md-input v-model="$v.contato.telefone.$model" maxlength="11" type="tel"></md-input>
          <span class="md-error" v-if="!$v.contato.telefone.required">Telefone e Requirido </span>
          <span class="md-error" v-if="
          !$v.contato.telefone.minLength || 
          !$v.contato.telefone.maxLength">
            Telefone e necessina ter 11 caracteres
          </span>
        </md-field>
      </div>
      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog()">Fechar</md-button>
        <md-button class="md-primary" type="submit" @click="submit()" :disabled="$v.$invalid">Salvar</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="showSnackbarSucess" md-persistent>
      <span>Operação realizada com sucesso!</span>
    </md-snackbar>
  </div>
</template>

<script>
import MainService from '../services/main.service'
import { required, minLength, maxLength} from 'vuelidate/lib/validators'
export default {
  name: "Contato",
  data: () => ({
    contatos: [],
    contatoId: "",
    contato: {
      nome: '',
      cpf: '',
      telefone: '',
    },
    showDialog: false,
    showDialogTitle:'',
    showSnackbarSucess: false
  }),
  validations:{
    contato:{
      nome: {
        required
      },
      cpf: {
        required,
        minLength: minLength(11),
        maxLength: maxLength(11)
      },
      telefone: {
        required,
        minLength: minLength(11),
        maxLength: maxLength(11)
      }
    }
  },
  mounted(){
    this.getData()
  },
  methods: {
    getData(){
      MainService.getGenreric('/contato').then((result)=>{
        this.contatos = result.data
      }).catch((error)=>{
        this.$swal.fire(
          'Lamentamos por isso',
          error.response.data[0].message,
          'info'
        )
      })
    },
    openDialog(title, obj){
      this.showDialogTitle = title
      this.showDialog = true
      if(obj){
        this.contatoId = obj.id
        this.contato = {
          nome: obj.nome,
          cpf: obj.cpf,
          telefone: obj.telefone,
        }
      }
    },
    closeDialog(){
      this.showDialog = false
      this.$v.$reset()
    },
    remove(obj){
      this.$swal.fire({
        title: 'você tem certeza ?',
        text: "o contato sera removido",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, exclua!'
      }).then((result) => {
        if (result.isConfirmed) {
          MainService.delGenreric(`/contato/${obj.id}`).then(() => {
            this.getData()
            this.$swal.fire(
              'Deletado!',
              'Contato Deletado com sucesso',
              'success'
            )
          }).catch((error)=>{
            this.$swal.fire(
              'Lamentamos por isso ',
              error.response.data[0].message,
              'info'
            )
          })
        }
      })
    },
    submit(){
      if(this.contatoId){
        MainService.putGenreric(`/contato/${this.contatoId}`, this.contato).then(()=>{
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
      }else{
        MainService.postGenreric('/contato', this.contato).then(()=>{
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
    }
  }
}
</script>