import students from "./participantcomponent/students.js"
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
       quiz_id(){
        return this.$route.params.id
    }
    },

    methods:{
       
 
    },
    components:{
        students
    }




} 