<template>
    <div id="visibleForm">
        <div class="crestik">
            <span @click="closeForm" class="material-symbols-outlined">
                close
            </span>
        </div>
        <h1 >Создать папку</h1>
        <input v-model="folderName" style="box-sizing:border-box;" type="text" class="form-control" id="formGroupExampleInput" :placeholder="placeholder">
        <div class="colors">
            <div @click="chooseColor(1)" :class="{'activeColor': activeColor==1}" class="color" id="color1" >
            </div>
            <div @click="chooseColor(2)" :class="{'activeColor': activeColor==2}" class="color" id="color2" >
            </div>
            <div @click="chooseColor(3)" :class="{'activeColor': activeColor==3}" class="color" id="color3" >
            </div>
            <div @click="chooseColor(4)" :class="{'activeColor': activeColor==4}" class="color" id="color4" >
            </div>
            <div @click="chooseColor(5)" :class="{'activeColor': activeColor==5}" class="color" id="color5" >
            </div>
            <div @click="chooseColor(6)" :class="{'activeColor': activeColor==6}" class="color" id="color6" >
            </div>
        </div>
        <div style="display:flex; justify-content:flex-end; box-sizing:border-box;">
            <button @click="addNewFolder"  id="saveFolder" class="btn btn-primary">
                Сохранить
            </button>
        </div>
    </div>
</template>

<script>
export default {
name:'NewFolder',
data(){
    return{
        newFolder:{
            folderName:'t',
            folderColor:'er'
        },
        folderName: '',
        activeColor:1,
        placeholder: 'Название папки'
    }
},
methods:{
    closeForm(){
        this.$emit('closeForm')
    },
    addNewFolder(){
        if (this.folderName.length>0 && this.activeColor != 0){
        this.newFolder.folderName = this.folderName
        this.newFolder.folderColor = this.activeColor
        this.$emit('addFolder', this.newFolder)
        this.closeForm()
        }
        else{
            this.placeholder = 'Поле имя не должно быть пустым'
        }
    },
    chooseColor(id){
        console.log(id);
        this.activeColor = id
    }
    
}
}
</script>

<style scoped>
    #visibleForm{
    position:absolute;
    display:block;
    bottom:25px;
    left:25px;
    width:400px;
    height:220px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    border-radius: 10px;
    padding-left:10px; padding-right:10px; padding-top:15px; 
    box-sizing: border-box;
    background-color: white;
    }
    .colors{
        display:flex;
        flex-direction:row;
        box-sizing: border-box;
        
    }
    .color{
        border-radius: 100%;
        height:40px;
        width:40px;
        margin-top:15px;
        margin-bottom: 10px;
        margin-right:10px;
        margin-left:10px;
    }
    .color:hover{
        cursor:pointer;
        border:2px solid rgb(77, 39, 39);
    }
    #color1{
        background-color: #C9D1D3;
    }
    #color2{
        background-color: #FFBBCC;
    }
    #color3{
        background-color: #B6E6BD;
    }
    #color4{
        background-color: rgb(102, 174, 175);
    }
    #color5{
        background-color: #e09cff;
    }
    #color6{
        background-color: #64C4ED;
    }

    .activeColor{
        border: 2px solid rgb(77, 39, 39)!important;
    }

    #saveFolder{
        display:flex;
        margin-right:10px;
        background-color:rgb(87, 190, 255);
        border: 0px solid rgb(0, 0, 0);
        width:100%;
        margin-left:10px;
        
    }
    .crestik{
        position:absolute;
        top:5px;
        right:5px;
        font-size:22px;
    }
    .crestik:hover{
        cursor:pointer
    }
</style>