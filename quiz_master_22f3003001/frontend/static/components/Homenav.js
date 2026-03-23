export default {
  template:
    `
    
      <div>
        <nav class="navbar navbar-dark fixed-top custom-navbar" style="background-color:rgb(17, 3, 25)">
          <div class="container-fluid">

            <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
              <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">Dark offcanvas</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>

              <div class="offcanvas-body">
                <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">

                  <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="/">Home</a>
                  </li>

                  <li class="nav-item" v-if="role==='admin'">
                    <a class="nav-link" href="#/students">Students</a>
                  </li>

                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Dropdown
                    </a>

                    <ul class="dropdown-menu dropdown-menu-dark">
                      <li><a class="dropdown-item" href="#" @click="back">Back</a></li>
                      <li><a class="dropdown-item" :href="'#/profile/'+user_id">Profile</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                  </li>

                </ul>

                <button @click="logout"> Logout </button>
              </div>

              <form class="d-flex mt-3" role="search">
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-success" type="submit">Search</button>
              </form>

            </div>

            <a class="navbar-brand d-flex align-items-center" href="#">
              <div class="profile-circle" style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden;">
                <img :src="'/static/images/profile_images/profile_' +user_id + '.jpg'" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">
                
               alt="Profile Image"
               class="img-fluid rounded shadow"
               style="height: 250px; width: 200px; object-fit: cover;">
              </div>

              <div>
                <span class="ms-2 text-white home_profile">
                  <router-link :to="{ name: 'profile', params: { id: user_id }}">Profile</router-link>
                </span>
              </div>
            </a>

          </div>
        </nav>
      </div>


 `,
  data() {
    return {
      profile: "static/images/profile.jpg",
      n: 0

    }
  },
   computed:{
    user_id(){
      return localStorage.getItem('id')
    },
    role(){
        return this.$store.getters.getrole
      }
  },
  methods:{
    logout: async function(){

        fetch('/logout', {
          method: 'POST',
          headers: {
            'Authentication-Token': localStorage.getItem("auth_token"),
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
            if (response.ok){
              this.n=1
            }  
            else{
              this.n=0 
          }
          return response.json()
        })
        .then((data)=>{
           if (this.n==1){
            localStorage.removeItem("auth_token");
            localStorage.removeItem("id");
            this.$store.dispatch('logout');
            console.log(data)
            alert(data)
            this.$router.push("/")
         }
          else{
            throw new Error(data.message)
           }           
        })
        .catch(error=>{
            console.log(error.message)
            alert(error.message)  
        })
    },
    back(){
      this.$router.back()
    },
  }

}