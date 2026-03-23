export default {
    template: `
   <div>       
      <button type="button" class="btn btn-dark" data-bs-toggle="modal" :data-bs-target="'#exampleModalquestion' + quizid">
                 Add Questions
         </button>

            <!-- Modal -->
            <div class="modal fade" :id="'exampleModalquestion' + quizid" tabindex="-1" :aria-labelledby="'exampleModalLabelq' + quizid" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" :id="'exampleModalLabelq' + quizid">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            
            <div class="modal-body">
              <form class="row g-3 needs-validation" novalidate>
                <div class="col-md-4">
                  <label :for="'validationCustom001q' + quizid" class="form-label">Question Statement</label>
                  <input type="text" class="form-control" :id="'validationCustom001q' + quizid" v-model="formdata.question_statement" required>
                </div>
                
                <div class="col-md-4">
                  <label :for="'validationCustom004q' + quizid" class="form-label">Marks</label>
                  <input type="text" class="form-control" :id="'validationCustom004q' + quizid" v-model="formdata.marks" required>
                </div>
                
                <div class="col-md-4">
                  <label :for="'validationCustom003q' + quizid" class="form-label">Correct Answer</label>
                  <input type="text" class="form-control" :id="'validationCustom003q' + quizid" v-model="formdata.correct_ans" required>
                </div>
                
               <div class="col-md-4">
                <label :for="'validationCustom002q' + quizid" class="form-label">Type</label>
                <select class="form-control" :id="'validationCustom002q' + quizid" v-model="formdata.type" required>
                  <option value="MCQ">MCQ</option>
                  <option value="Q/A">Q/A</option>
                </select>
              </div>
              </form>      
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click="createquestion" data-bs-dismiss="modal" :disabled="isFormIncomplete">Save changes</button>
           </div>
    </div>
  </div>
</div>
</div>
    


`,
props:["quizid"],

data: function(){
    return{
       formdata:{
           question_statement:"", 
           type:"",
           marks:"",
           correct_ans:""
           
       },
    }

},
computed: {
  isFormIncomplete() {
    return !this.formdata.question_statement.trim() ||
           !this.formdata.marks.trim() ||
           !this.formdata.correct_ans.trim();
  }
},


methods:{
   createquestion: async function(){
    console.log("Creating question for quiz:", this.quizid)
       const ans= await fetch(`/api/ques/create/${this.quizid}`,{
           method:"POST",
           headers:{
               "Content-Type":"application/json",
               "Authentication-Token": localStorage.getItem("auth_token"),
           },
           body: JSON.stringify(this.formdata)
           
       })
       .then(response => { return response.json()          
                        })
                        
       .then(data => {
        console.log(data[0])
        this.$emit("questionCreated", data[0]);
         this.formdata.question_statement=""
         this.formdata.type=""
         this.formdata.marks=""
         this.formdata.correct_ans=""

          console.log(data)
           
       })
   }
 }
}
