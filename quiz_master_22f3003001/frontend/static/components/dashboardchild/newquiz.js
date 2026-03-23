export default {
    template: `<div>
               <div id="carouselExampleCaptions" class="carousel slide" style="border: 10px black solid;">
                <div class="carousel-indicators">
                    <button v-for="(things, index) in newthings" :key="things.id"
                        type="button" data-bs-target="#carouselExampleCaptions"
                        :data-bs-slide-to="index" :class="{ active: index === 0 }"
                        :aria-label="'Slide ' + (index + 1)">
                    </button>
                </div>
                <div class="carousel-inner">
                    <div class="carousel-item" v-for="(things, index) in newthings" :key="things.id" :class="{ active: index === 0 }">
                        <img :src="'/static/images/subject_images/subject_' +things.subject_id + '.jpg'" class="d-block w-100" style="height: 400px; object-fit: cover;" alt="...">
                        <div class="carousel-caption d-none d-md-block" style="color:black;">
                          <b>  <h1>{{ things.name }}</h1>  </b>
                            <h2>{{ things.description }}</h2>
                        </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
                </div>
               </div> 
    
    
    `,
 data(){
    return{
        newthings:[],
        profile:"static/images/image22.png",
        n:0,
    }

 }   ,
 created(){
  this.quizdata()
 },
 methods:{
    quizdata:async function(){
        const ans=await fetch("/api/newquiz",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authentication-token":localStorage.getItem("auth_token")
            }
        })
        .then(response=>{
            
            if (response.ok){
                this.n=1
            }
            
            return response.json()
            
        })
        .then(data=>{
            if(this.n===1){
                this.newthings=data
                console.log(data.message)
            }
            else{
                console.log("data.message")
            }
            
        }

        )
    }
 },
 mounted(){
    this.$store.dispatch('checkAuthentication');
 }

}