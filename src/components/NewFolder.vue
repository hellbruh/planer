<template>
  <div id="visibleForm">
    <h1 @click="addNewFolder" >ttt</h1>
      <input style="box-sizing:border-box;" type="text" class="form-control" id="formGroupExampleInput" placeholder="Example input placeholder">
    <div class="colors">
        <div>

        </div>
    </div>
  
  </div>
</template>

<script>
export default {
name:'NewFolder',
data(){
    return{
        newFolder:{
            name:'t',
            color:'er'
        }
    }
},
methods:{
    addNewFolder(){
        this.$emit('addFolder', this.newFolder)
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
    height:200px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    border-radius: 10px;
    padding-left:10px; padding-right:10px; padding-top:15px; 
    box-sizing: border-box;
    }
    .colors{
        display:flex;
        flex-direction:row;
        
    }
</style>