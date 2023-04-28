<template>
  <div id="app">
    <!-- левая колонка с папками -->
	<div id="left-column">
		<!-- кнопка для всех задач -->
		<div v-if="folders.length!==0" class="folder">
			<span class="material-symbols-outlined">
				list
			</span>			
			Все задачи
        </div>

		<div 
			class="folders" 
			v-for="(folder) in folders"
			:key=folder.id
		>
		<!-- пишем что хотим видеть у каждой папки в циле, папки=кнопки -->
			<div class="folder">
				<div class="round" v-bind:id="'color'+folder.color">
				</div>
				<div class="folderName">
					{{folder.name}}
				</div>
			</div>
		
		</div>
        <!-- кнопка добавления папки -->
        <div id="createFolderButton" @click="addFolder()">
			<span class="material-symbols-outlined">
				add
			</span>
          Добавить папку
        </div>
      
      <!-- добавление папки -->
        <new-folder v-if="visibleForm===1" @addFolder="addNewFolder" @closeForm="closeForm" ></new-folder>
          
  </div>
<!-- правая колонка с задачами -->
    <div id="right-column">
		<div v-if="tasks.length===0">
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
    NewFolder,
  },
  data(){
    return{
      folders:[
		// {
		// 	name:'h',
		// 	color:'1'
		// },
		// {
		// 	name:'rgefg',
		// 	color:'2'
		// }
		],
    tasks:[

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
	flex-direction:row;
	margin:0%;
}
.folders{
    display: flex;
    flex-direction:column;
    justify-content: center;
    text-align:justify;
	align-items: flex-start;
 }
 #nothing{
	font-family: 'Sofia Sans', sans-serif;
	font-size:100px;
  display: flex;
  justify-content:center;
  align-items:center;
  color:#76767623
 }
 #createFolderButton{
	width:100%;
	height:40px;
	display:flex;
	font-size: 18px;
	color: #767676;
	font-family: 'Lato', sans-serif;
	font-weight:500;
	justify-content:flex-start;
	align-items:center;
  margin-top:10px;
 }
#createFolderButton:hover{
	cursor:pointer;
 }

 #left-column{
	width:200px;
	height:100vh;
	display:flex;
	flex-direction:column;
	align-items: flex-start;
	justify-content: center;
	box-sizing: border-box;
	padding-left:10px;
	padding-right:10px;
	background-color:#F1F1F1;
 }
 .folder{
	display:flex;
	flex-direction: row;
	height:40px;
	width:100%;
	font-size: 20px;
	color: #000000a9;
	font-family: 'Lato', sans-serif;
	font-weight:500;
	justify-content:flex-start;
	align-items:center;
  margin-top:8px;
 }
 .folder:hover{
	cursor:pointer;
 }
 .round{
	display:flex;
	justify-content: center;
	align-items: center;
    border-radius: 100%;
	height:10px;
	width:10px;
	margin-right:10px;
    }
#color1{
        background-color: rgb(247, 223, 208);
    }
#color2{
        background-color: rgb(209, 112, 112);
    }
#color3{
        background-color: rgb(131, 170, 109);
    }
#color4{
        background-color: rgb(102, 174, 175);
    }
#color5{
        background-color: rgb(174, 138, 199);
    }
#color6{
        background-color: rgb(197, 85, 160);
    }

#right-column{
  display:flex;
  justify-content: center;
  align-items: center;
  width:100%;
  height:100vh;
}

</style>
