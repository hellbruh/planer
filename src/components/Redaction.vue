<template>
    <div id="visibleForm">
        <div class="crestik">
            <span @click="closeFunctools" class="material-symbols-outlined">
                close
            </span>
        </div>
        <h2>{{folderName}}</h2>
        <div>
            <ul class="list-group" id="list">
                <li class="list-group-item">Редактировать</li>
                <li class="list-group-item">Удалить</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
name:'NewFolder',
props:{
    folderName:{
        type:String
    }
},
data(){
    return{
        newFolder:{
            folderName:'t',
            folderColor:'er'
        },

    }
},
methods:{
    closeFunctools(){
        this.$emit('closeFunctools')
    },
    
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
    height:200px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    border-radius: 10px;
    padding-left:10px; padding-right:10px; padding-top:15px; 
    box-sizing: border-box;
    background-color: white;
    }
    #list{
        margin-top:30px;
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