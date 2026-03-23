export default {
    template: `
    <div>
        <button type="button" class="btn btn-dark" data-bs-toggle="modal" :data-bs-target="'#modal-' + subid">
            Update
        </button>

        <!-- Modal -->
        <div class="modal fade" :id="'modal-' + subid" tabindex="-1" :aria-labelledby="'modalLabel-' + subid" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" :id="'modalLabel-' + subid">Update Subject</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">
                        <form class="row g-3 needs-validation" novalidate>
                            <div class="col-md-4">
                                <label for="validationCustom001" class="form-label">Name</label>
                                <input type="text" class="form-control" id="validationCustom001"
                                    v-model="formdata.name" required>
                            </div>

                            <div class="col-md-4">
                                <label for="validationCustom002" class="form-label">Description</label>
                                <input type="text" class="form-control" id="validationCustom002"
                                    v-model="formdata.description" required>
                            </div>

                            <div class="col-md-4">
                                <label for="validationCustom003" class="form-label">Field</label>
                                <input type="text" class="form-control" id="validationCustom003"
                                    v-model="formdata.field" required>
                            </div>

                            <div class="col-md-4">
                                Subject Image
                                <input type="file" @change="onFileChange" />
                            </div>
                        </form>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" 
                            @click="editsub" 
                            data-bs-dismiss="modal" 
                            :disabled="isDisabled">
                            Save changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,

    props: ["subid", "subname", "subdes", "subfield"],

    data() {
        return {
            formdata: {
                name: this.subname || "",
                description: this.subdes || "",
                field: this.subfield || ""
            },
            file: null
        }
    },

    computed: {
        isDisabled() {
            // Prevents .trim() errors
            const name = (this.formdata?.name || "").trim();
            const desc = (this.formdata?.description || "").trim();
            const field = (this.formdata?.field || "").trim();
            return name === "" || desc === "" || field === "";
        }
    },

    methods: {
        async editsub() {
            console.log("editing subject:", this.subid);

            const res = await fetch(`/api/sub/update/${this.subid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token"),
                },
                body: JSON.stringify(this.formdata),
            });

            const data = await res.json();

            if (this.file) {
                const imageForm = new FormData();
                imageForm.append('image', this.file);
                await fetch(`/upload_subject/${data[0].id}`, {
                    method: 'POST',
                    headers: {
                    'Authentication-Token': localStorage.getItem('auth_token') 
                    },
                    body: imageForm
                });
            }

            this.$emit("subupdated");
            this.$emit("refreshimage", this.subid);
            console.log("Updated subject:", data[0]);
        },

        onFileChange(e) {
            this.file = e.target.files[0];
        },
    }
}
