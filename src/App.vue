<template>
  <div id="app">
    <div v-if="folders.length===0">
      <p id="nothing">Задач нет</p>
    </div>
    <div id="folders" v-for="(folder) in folders"
    :key=folder.id>
      <div>
        <button class="folderButton"></button>
      </div>
      <button id="createFolderButton" @click="addFolder()">Create</button>
      <div v-if="visibleForm===1">
        <new-folder></new-folder>
      </div>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import NewFolder from './components/NewFolder.vue'
export default {
  name: 'App',
  components: {
    NewFolder
  },
  data(){
    return{
      folders:[
        // {
        //   id: 1,
        //   name: 'work',
        //   color: '#FFF0F5'
        // },
        // {
        //   id:2,
        //   name:'weee',
        //   color:'#FAEBD7'
        // }

      ],
      visibleForm:0,

    }
  },
  methods:{
    addFolder(){
      this.visibleForm = 1
    }
  }
}
</script>

<style>
#app{
  display:flex;
  flex-direction:column;
  margin:0%;
}
#folders{
    display: flex;
    flex-direction:column;
    justify-content: center;
    text-align:justify;
 }
 #nothing{
  font-family: 'Sofia Sans', sans-serif;
  font-size:28px;
 }
 #createFolderButton{
  width:100px;
  height:100px;
  display:flex;
 }
 
</style>
