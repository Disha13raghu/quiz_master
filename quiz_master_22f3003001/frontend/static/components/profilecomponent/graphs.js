
export default {
  
    template:`
       <div class="charts-container" style="display: flex; gap: 20px; padding: 20px;">
         <!-- Line Chart for Weekly Quiz Activity -->
         <div class="chart-wrapper" style="flex: 1; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 15px;">
           <apexchart 
           type="line" 
           height="300" 
           :options="lineChartOptions" 
           :series="lineSeries">
           </apexchart>
         </div>
         
         <!-- Radial Bar for Overall Accuracy -->
         <div class="chart-wrapper" style="flex: 1; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 15px;">
           <apexchart 
           type="radialBar" 
           height="300" 
           :options="radialChartOptions" 
           :series="radialSeries">
           </apexchart>
         </div>
       </div>
    `,
    data(){
        return{
            scores: [],
            recentScores:[],
            lineSeries: [],
            radialSeries: [],
            lineChartOptions: {
                chart: {
                    type: 'line',
                    height: 300,
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    }
                },
                stroke: {
                    curve: 'smooth',
                    width: 3
                },
                colors: ['#3b82f6'],
                xaxis: {
                    categories: [],
                    title: {
                        text: 'Week',
                        style: {
                            fontSize: '14px',
                            fontWeight: 600
                        }
                    }
                },
                yaxis: {
                    title: {
                        text: 'Average Quizzes',
                        style: {
                            fontSize: '14px',
                            fontWeight: 600
                        }
                    }
                },
                title: {
                    text: 'Weekly Quiz Activity',
                    align: 'center',
                    style: {
                        fontSize: '18px',
                        fontWeight: 600
                    }
                },
                grid: {
                    borderColor: '#e5e7eb'
                },
                markers: {
                    size: 6,
                    colors: ['#3b82f6'],
                    strokeColors: '#fff',
                    strokeWidth: 2
                }
            },
            radialChartOptions: {
                chart: {
                    type: 'radialBar',
                    height: 300
                },
                plotOptions: {
                    radialBar: {
                        hollow: {
                            size: '60%'
                        },
                        dataLabels: {
                            name: {
                                fontSize: '16px',
                                fontWeight: 600
                            },
                            value: {
                                fontSize: '24px',
                                fontWeight: 700,
                                formatter: function (val) {
                                    return val + '%'
                                }
                            }
                        }
                    }
                },
                colors: ['#10b981'],
                labels: ['Overall Accuracy'],
                title: {
                    text: 'Score Accuracy',
                    align: 'center',
                    style: {
                        fontSize: '18px',
                        fontWeight: 600
                    }
                }
            }
        }
    },
    props:['user_id'],
    mounted(){
        this.$store.dispatch('checkAuthentication');
        this.getscores()
    },
    computed:{
       
      u_id(){
        return this.$route.params.id
      },
      role(){
        return this.$store.getters.getrole
      }
    },

    methods:{
       getscores:async function(){
       
       
       let res= await fetch(`/api/scoreall/get/${this.user_id}`,{
        method:"GET",
          headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
       })
       if (res.ok){
           
         let data =await res.json()
         this.scores=data
         console.log(this.scores)

         // Process data for weekly quiz activity
         this.processWeeklyData()
         
         // Calculate overall accuracy
         this.calculateOverallAccuracy()
       }
       else{
         console.log("some internal error")
       }
    },
    
    processWeeklyData() {
            const weeklyData = {};

            this.scores.forEach(score => {
                const date = new Date(score.attempted_on);
                
                // Clone the date to avoid mutation
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay()); // Sunday as start
                weekStart.setHours(0, 0, 0, 0); // Clean time

                const weekKey = weekStart.toISOString().split('T')[0];

                if (!weeklyData[weekKey]) {
                weeklyData[weekKey] = [];
                }
                weeklyData[weekKey].push(score);
            });

            const weeks = Object.keys(weeklyData).sort().slice(-8); // Last 8 weeks

            const weekLabels = weeks.map((week, index) => `Week ${index + 1}`);
            const averageQuizzes = weeks.map(week => weeklyData[week].length);

            this.lineChartOptions.xaxis.categories = weekLabels;
            this.lineSeries = [{
                name: 'Quizzes Attempted',
                data: averageQuizzes
            }];
}
,
    
    calculateOverallAccuracy() {
        if (this.scores.length === 0) {
            this.radialSeries = [0];
            return;
        }

        let totalScored = 0;
        let totalPossible = 0;

        this.scores.forEach(score => {
            totalScored += parseFloat(score.marks || 0);
            totalPossible += parseFloat(score.total_marks || 100); // Fallback to 100 if missing
        });

        const accuracy = Math.round((totalScored / totalPossible) * 100);
        this.radialSeries = [accuracy];
}

 
    },
    components:{
       
    }
}