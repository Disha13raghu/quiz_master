import question from "./quizcomponent/question.js"

export default {
    template: `
      <div> 
        <div >
             <div>
                    <question :quiz_id="id"  />                                              
                    
            </div>
            <div >
                   
            </div>
            
        </div>
      </div>
    
    `,
   
    data(){
        return {
                
        }
    },
    props: ['id'],
    mounted(){
       
        this.$store.dispatch('checkAuthentication')
        
    },
    
  
    methods: {
    },
    
    
    components: {
        question,
    },
}

