
import chapter from "./chapter.js"
import createchap from "./subject_component/createchap.js"
import chapters from "./subject_component/chapters.js"
export default {
    template: 
    `
      <div style="text-align:center;"> 
            <chapters :subid="id"  ref="subref"></chapters>

            <createchap :subid="id" @chapcreated="chapcreated" v-if="role==='admin'"> </createchap>         
      
      </div>
    `
    ,
    data(){

        return {
        }
    },

    props: ['id'],

    mounted(){
       this.$store.dispatch('checkAuthentication')
    },


    methods:{
        chapcreated: async function(chap){
            this.$refs.subref.addchap(chap)
        },
         
        
    },
     computed:{
          role() {
           return this.$store.getters.getrole; 
   }
},

    components: {
            chapter,
            createchap,
            chapters,
        },

         
        }
