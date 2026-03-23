export default {
  template: `
<div> 
  <!-- Circular Ring Button with Plus Sign -->
  <button type="button" class="create-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
    CREATE
  </button>

  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Create Subject</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form class="row g-3 needs-validation" novalidate @submit.prevent>
            <div class="col-md-4">
              <label for="validationCustom001" class="form-label">First name</label>
              <input
                type="text"
                class="form-control"
                id="validationCustom001"
                v-model="formdata.name"
                required
              >
              <div class="valid-feedback">Looks good!</div>
            </div>

            <div class="col-md-4">
              <label for="validationCustom002" class="form-label">Description</label>
              <input
                type="text"
                class="form-control"
                id="validationCustom002"
                v-model="formdata.description"
                required
              >
              <div class="valid-feedback">Looks good!</div>
            </div>

            <div class="col-md-4">
              <label for="validationCustom003" class="form-label">Field</label>
              <input
                type="text"
                class="form-control"
                id="validationCustom003"
                v-model="formdata.field"
                required
              >
              <div class="valid-feedback">Looks good!</div>
            </div>

            <div class="col-md-4">
              <label class="form-label">Subject Image</label>
              <input type="file" @change="onFileChange" accept="image/*">
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>

          <button
            type="button"
            class="btn btn-primary"
            @click="createsub"
            :disabled="isDisabled || loading"
            data-bs-dismiss="modal"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
  `,

  data() {
    return {
      formdata: {
        name: '',
        description: '',
        field: ''
      },
      d: [],
      file: null,
      loading: false
    };
  },

  computed: {
    isDisabled() {
      const { name = '', description = '', field = '' } = this.formdata || {};
      return (
        name.trim() === '' ||
        description.trim() === '' ||
        field.trim() === ''
      );
    }
  },

  methods: {
    async createsub() {
      try {
        this.loading = true;

        const res = await fetch('/api/sub/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('auth_token') // if needed
          },
          body: JSON.stringify(this.formdata)
        });

        if (!res.ok) {
          throw new Error(`Create failed: ${res.status} ${res.statusText}`);
        }

        const data = await res.json(); // assuming data is an array
        this.d = data;

        // Only upload if there is a file
        if (this.file && data?.[0]?.id) {
          const imageForm = new FormData();
          imageForm.append('image', this.file);

          const imgRes = await fetch(`/upload_subject/${data[0].id}`, {
            method: 'POST',
            headers: {
            'Authentication-Token': localStorage.getItem('auth_token') // if needed
          },
            body: imageForm
          });

          if (!imgRes.ok) {
            console.warn('Image upload failed:', imgRes.statusText);
          }
        }

        this.$emit('subjectcreated', this.d[0]);

        // Reset form
        this.formdata = {
          name: '',
          description: '',
          field: ''
        };
        this.file = null;

      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    onFileChange(e) {
      this.file = e.target.files[0] || null;
    }
  }
};
