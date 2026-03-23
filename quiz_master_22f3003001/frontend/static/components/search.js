export default {
    template: `
      <div> 
           <div>
           _______________________________________________________________________________________
           </div>
      
      </div>
    
    `,
    mounted(){
      this.$store.dispatch('checkAuthentication');
   },
}