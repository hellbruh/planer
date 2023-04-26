<template>
  <div id="app">
    
    <!-- левая колонка с папками -->
  <div id="left-column">
      <div 
        id="folders" 
        v-for="(folder) in folders"
        :key=folder.id
      >
      <!-- пишем что хотим видеть у каждой папки в циле, папки=кнопки -->
        <div>
          <button class="folderButton"></button>
        </div>
      </div>
        <!-- кнопка добавления папки -->
        <button id="createFolderButton" @click="addFolder()">Create</button>
      
      <!-- добавление кнопки -->
          <new-folder v-if="visibleForm===1" @addFolder="addNewFolder" @closeForm="closeForm" ></new-folder>
          
  </div>
<!-- правая колонка с задачами -->
    <div id="right-column">
      <div v-if="folders.length===0">
        <p id="nothing">Задач нет</p>
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
    },
    addNewFolder(data){
      console.log(data)
      this.folders.push(data)
      console.log(this.folders)
    },
    closeForm(){
      this.visibleForm = 0
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

 #left-column{
  width:100px;
  
 }

</style>
