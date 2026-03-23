import students from "./profilecomponent/student.js"
export default {
  
    template:`
           <students></students>
    `,
    data(){
        return{
          students:[]
        }
    },
    mounted(){
        this.$store.dispatch('checkAuthentication');
          
    },
    computed:{
     
    },

    methods:{
       
 
    },
    components:{
        students
    }




} 
