

export default {
    template: `
       <div style="display: flex; justify-content: center; margin-top: 50px;">
    <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #f8f9fa;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
        width: fit-content;
      "
    >
      <!-- Navigation Links -->
      <div style="display: flex; gap: 20px; margin-bottom: 20px;">
        <router-link
          to="/"
          style="text-decoration: none; color: #007bff; font-weight: bold;"
          exact-active-class="active-link"
        >
          Login
        </router-link>
        <router-link
          to="/register"
          style="text-decoration: none; color: #007bff; font-weight: bold;"
          exact-active-class="active-link"
        >
          Register
        </router-link>
      </div>

      <h3 style="color: #343a40; margin-bottom: 20px; font-weight: bold;">Login</h3>

      <!-- Email -->
      <div class="form-floating mb-3">
        <input
          type="email"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          v-model="formData.email"
          style="width: 350px"
          required
        />
        <label for="floatingInput">Email address</label>
      </div>

      <!-- Password -->
      <div class="form-floating">
        <input
          type="password"
          class="form-control"
          id="floatingPassword"
          placeholder="Password"
          v-model="formData.password"
          style="width: 350px"
          required
        />
        <label for="floatingPassword">Password</label>
      </div>

      <!-- Login Button -->
      <button
        class="btn"
        :style="{
          marginTop: '20px',
          cursor: 'pointer',
          backgroundColor: formData.email && formData.password ? '#007bff' : '#6c757d',
          color: 'white',
          padding: '10px 30px',
          borderRadius: '5px',
          fontWeight: 'bold',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 123, 255, 0.4)',
          transition: 'background-color 0.3s ease'
        }"
        @click="loginUser"
        :disabled="formData.email.trim() === '' || formData.password.trim() === ''"
      >
        Login
      </button>
    </div>
  </div>    
    `,

    data: function () {
        return {
            formData: {
                email: "",
                password: "",
                username: ""
            },
            m: 0
        }

    },
    computed: {
        isAuthenticated() {

            return this.$store.getters.isAuthenticated;
        },
    },
    mounted() {
        this.load()
    },


    methods: {
        loginUser: function () {
            fetch('/api/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.formData)

            })
                .then(response => {
                    if (response.ok) {
                        this.m = 1
                    }
                    else {
                        this.m = 0
                    }
                    return response.json()
                })

                .then(data => {
                    if (this.m == 1) {
                        console.log(data)
                        localStorage.setItem("auth_token", data["auth-token"])
                        localStorage.setItem("id", data.id)
                        this.message = data.message
                        this.$store.dispatch('login');
                        alert("Login successful")
                        this.$router.push("/dashboard")
                    }
                    else {
                        throw new Error(data.message)
                    }

                })
                .catch(error => {
                    console.log(error)
                    alert(error.message)
                })
        },
        load: async function () {
            if (this.isAuthenticated) {
                this.$router.push('/dashboard');
            }
        },
    },

}