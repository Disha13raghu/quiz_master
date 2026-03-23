export default {
    template: `
      <div
    style="max-width: 500px; margin: 40px auto; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); padding: 30px; border-radius: 12px; background: linear-gradient(135deg, #f8f9fa, #e3f2fd);"
  >
    
    <!-- Heading -->
    <div style = "display : flex; justify-content:space-around;algin-self:center;">
    <h5 style="text-align: center; margin-bottom: 20px; color: #0d6efd;font-weight : bold;">Register</h5>
    <div style="text-align: ; ">
      <router-link
        to="/"
        style="text-decoration: none; color: #0d6efd;font-size: 20px;font-weight : bold;"
      >
       Login
      </router-link>
     </div>
    </div>
    <div style="color: red; text-align: center; margin-bottom: 15px;">{{ message }}</div>

    <!-- Register Form -->
    <form class="needs-validation" novalidate @submit.prevent="registeruser">
      <!-- Email -->
      <div class="form-floating mb-3">
        <input
          type="email"
          class="form-control shadow-sm"
          id="floatingInput"
          placeholder="name@example.com"
          v-model="formdata.email"
        />
        <label for="floatingInput">Email address</label>
      </div>

      <!-- Password -->
      <div class="form-floating mb-3">
        <input
          type="password"
          class="form-control shadow-sm"
          id="floatingPassword"
          placeholder="Password"
          v-model="formdata.password"
        />
        <label for="floatingPassword">Password</label>
      </div>

      <!-- First Name -->
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control shadow-sm"
          id="floatingFirstName"
          placeholder="First Name"
          v-model="formdata.f_name"
        />
        <label for="floatingFirstName">First Name</label>
      </div>

      <!-- Last Name -->
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control shadow-sm"
          id="floatingLastName"
          placeholder="Last Name"
          v-model="formdata.l_name"
        />
        <label for="floatingLastName">Last Name</label>
      </div>

      <!-- Username -->
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control shadow-sm"
          id="floatingUsername"
          placeholder="Username"
          v-model="formdata.username"
        />
        <label for="floatingUsername">Username</label>
      </div>

      <!-- Qualification -->
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control shadow-sm"
          id="floatingQualification"
          placeholder="Qualification"
          v-model="formdata.qualification"
        />
        <label for="floatingQualification">Qualification</label>
      </div>

      <!-- DOB -->
      <div class="form-floating mb-3">
        <input
          type="date"
          class="form-control shadow-sm"
          id="floatingDOB"
          placeholder="Date of Birth"
          v-model="formdata.dob"
        />
        <label for="floatingDOB">Date of Birth</label>
      </div>

      <!-- Field -->
      <div class="form-floating mb-4">
        <input
          type="text"
          class="form-control shadow-sm"
          id="floatingField"
          placeholder="Field"
          v-model="formdata.field"
        />
        <label for="floatingField">Field</label>
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button
          type="submit"
          class="btn"
          :style="{
            backgroundColor: '#0d6efd',
            color: 'white',
            padding: '10px 25px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(13, 110, 253, 0.4)',
            borderRadius: '8px'
          }"
        >
          Submit Form
        </button>
      </div>
    </form>
  </div>    
    `,
    data: function(){
              return{
                formdata:{
                    email:"",
                    username:"",
                    password:"",
                    dob:"",
                    f_name:"",
                    l_name:"",
                    qualification:"",
                    field:""
                },
                message:""
              }

    },
    methods:{
        registeruser: async function(){
            let resp=await fetch("/api/registration",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(this.formdata)
            })
            let data= await resp.json()
            this.message=data.message
            if (resp.ok){
                alert(data.message)
                .then(this.$router.push("/login"))

                 }
            else{
                alert(data.message)
            }    
            
        }

    }

}