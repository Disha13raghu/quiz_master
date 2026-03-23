export default {
  
    template: `
      
      <div> Home dskjjdiiiiiiiiii </div>
    
    `,


    computed: {
      isAuthenticated() {
  
              return this.$store.getters.isAuthenticated;
            
      },
    },
      mounted(){
        this.load()
      },

      methods:{
         load: async function(){
          if (this.isAuthenticated){
            this.$router.push('/dashboard');
          }
         }

      }
  }
