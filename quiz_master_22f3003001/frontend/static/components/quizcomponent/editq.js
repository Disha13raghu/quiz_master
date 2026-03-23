export default {
    template: `
   <div>       
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#exampleModal123editq:' + question.id" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
                 Edit 
      </button>

            <!-- Modal -->
            <div class="modal fade" :id="'exampleModal123editq:' + question.id" tabindex="-1" :aria-labelledby="'exampleModalLabel123editq:' + question.id" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" :id="'exampleModalLabel123editq:' + question.id">Edit Question</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            
            <div class="modal-body">
              <form class="row g-3 needs-validation" novalidate>
                <div class="col-md-4">
                  <label :for="'validationCustom0011:editq' + question.id" class="form-label">Question Statement</label>
                  <input type="text" class="form-control" :id="'validationCustom0011:editq' + question.id" v-model="formdata.question_statement" required>
                </div>
                
                <div class="col-md-4">
                  <label :for="'validationCustom0041:editq' + question.id" class="form-label">Marks</label>
                  <input type="text" class="form-control" :id="'validationCustom0041:editq' + question.id" v-model="formdata.marks" required>
                </div>
                
                <div class="col-md-4">
                  <label :for="'validationCustom0031:editq' + question.id" class="form-label">Correct Answer</label>
                  <input type="text" class="form-control" :id="'validationCustom0031:editq' + question.id" v-model="formdata.correct_ans" required>
                </div>
                <div class="col-md-4">
                  <label :for="'validationCustom0021:editq'+question.id" class="form-label">Type</label>
                  <select class="form-control" :id="'validationCustom0021:editq' + question.id" v-model="formdata.type" required>
                    <option value="MCQ">MCQ</option>
                    <option value="Q/A">Q/A</option>
                  </select>
                </div>
                
              </form>      
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click="editquestion" data-bs-dismiss="modal" :disabled="formdata.question_statement.trim() === ''||formdata.marks.trim() === ''||formdata.correct_ans.trim() === '' ">Save changes</button>
           </div>
    </div>
  </div>
</div>
</div>
    


`,
props:["question"],

data: function(){
    return{
       formdata:{
           quizid:this.question.id,
           question_statement:this.question.question_statement, 
           type:this.question.type,
           marks:this.question.marks,
           correct_ans:this.question.correct_ans||"abc",
           
       },
    }

},



methods:{
   editquestion: async function(){
    console.log(this.question)
    console.log("Creating question for quiz:", this.formdata.quizid)
       const ans= await fetch(`/api/ques/update/${this.formdata.quizid}`,{
           method:"PUT",
           headers:{
               "Content-Type":"application/json",
               "Authentication-Token": localStorage.getItem("auth_token"),
           },
           body: JSON.stringify(this.formdata)
           
       })
       .then(response => { return response.json()          
                        })
                        
       .then(data => {
        this.$emit("questionEdited", data.question);
          console.log(data)
       })
   }
 }
}