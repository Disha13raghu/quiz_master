import createquiz from "./chaptercomponents/createquiz.js"
import quiz from "./chaptercomponents/quiz.js"


export default {
    template: `
      <div> 
           
            <quiz :ch_id="id" ref="quizref"></quiz>
            <br>
            <div v-if="role==='admin'">
              <createquiz :cid="id" @quizcreated="quizcreated"  > </createquiz>
            </div>
      </div>
    `,

    data() {
        return {
        };
    },
    computed:{
        role(){
            return this.$store.getters.getrole; 
        }
    },
    props: ['id'],
    mounted() {
        
        this.$store.dispatch('checkAuthentication');
         
    },
    methods: {
        quizcreated: async function(quiz){
            this.$refs.quizref.addquiz(quiz)
        },
    },
    components: {
        createquiz,
        quiz,
    },
};
