export default {
  template:`
      <div>
          <div> 
              <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#exampleModal'+user_id">
                    Update
              </button>

              <!-- Modal -->
                <div class="modal fade" :id="'exampleModal'+user_id" tabindex="-1" :aria-labelledby="'exampleModalLabel'+user_id" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Update Profile</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form class="row g-3 needs-validation" novalidate>
                        <div class="form-floating mb-3">
                            <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="formdata.email" disabled>
                            <label for="floatingInput">Email address</label>
                            </div>
                           
                    <div class="col-md-4">
                        <label for="validationCustom001" class="form-label">First name</label>
                        <input type="text" class="form-control" id="validationCustom001" value="Mark" v-model="formdata.f_name" required>
                        <div class="valid-feedback">
                        Looks good!
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label for="validationCustom002" class="form-label">Last name</label>
                        <input type="text" class="form-control" id="validationCustom002" value="Otto" v-model="formdata.l_name" required>
                        <div class="valid-feedback">
                        Looks good!
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label for="validationCustomUsername" class="form-label">Username</label>
                        <div class="input-group has-validation">
                        <span class="input-group-text" id="inputGroupPrepend">@</span>
                        <input type="text" class="form-control" id="validationCustomUsername" aria-describedby="inputGroupPrepend" v-model= "formdata.username" required disabled>
                        <div class="invalid-feedback">
                            Please choose a username.
                        </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label for="validationCustom01" class="form-label">qualifications</label>
                        <input type="text" class="form-control" id="validationCustom01" v-model="formdata.qualification" required>
                        <div class="invalid-feedback">
                        Please provide a valid city.
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <label for="validationCustom02" class="form-label">dob</label>
                        <input type="text" class="form-control" id="validationCustom02" v-model="formdata.dob" required>
                        <div class="invalid-feedback">
                        provide a valid value
                        </div>
                    </div>

                    <div class="col-md-6">
                        <label for="validationCustom03" class="form-label">field</label>
                        <input type="text" class="form-control" id="validationCustom03" v-model="formdata.field" required>
                        <div class="invalid-feedback">
                        Please provide a valid  value.
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Subject Image</label>
                        <input type="file" @change="onFileChange" accept="image/*">
                    </div>
                    
                    </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary"  @click.prevent="editprofile">Save changes</button>
                    </div>
                    </div>
                </div>
                </div>
              
              
              
                    <div>
                    {{formdata.username}} hello
                    </div>
          </div>
      </div>
  
  `,
  data(){
   return{
     file: null,
     user:[]
   }
  },
  props:['formdata'],
  mounted(){
    this.$store.dispatch('checkAuthentication');
  },
  computed:{
       role(){
        return this.$store.getters.getrole;
    },
    user_id(){
        return localStorage.getItem('id')
    }
    
    
  },
  methods:{
         editprofile: async function(){
            await fetch("/api/user/update",{
                method:"PUT",
                headers:{
                    "Authentication-Token":localStorage.getItem('auth_token'),
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(this.formdata)
            })
            .then(res=>{
                return res.json()
            })
            .then(data=>{
                console.log(data)
                this.user=data
                
            })
            .catch(error=>{
                console.log(error)
            })

            if (this.file && this.user?.id) {
                const imageForm = new FormData();
                imageForm.append('image', this.file);

                const imgRes = await fetch(`/upload_profile`, {
                    method: 'POST',
                    headers:{
                    "Authentication-Token":localStorage.getItem('auth_token')
                    //"Content-Type":"application/json"
                },
                    body: imageForm
                });

                if (!imgRes.ok) {
                    console.warn('Image upload failed:', imgRes.statusText);
                }
        }
         },
         onFileChange(e) {
             this.file = e.target.files[0] || null;
    }
  

  }


}