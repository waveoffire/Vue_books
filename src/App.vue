<template>
  <div class="container">
    <div
      class="card card-info card-outline"
      style="  min-height: 97vh;
  margin-top: 20px;"
    >
      <div
        class="card-header"
        style="background-color:rgba(0, 0, 0, 0.1);"
      >
        <h3 class="card-title">Wyszukiwarka książek
        </h3>
      </div>
      <div
        class="card-body p-3"
        style="background-color:rgba(0, 0, 0, 0.03);"
      >
        <div
          class="table-responsive mailbox-messages"
          style="overflow:hidden"
        >

          <div class="row">
            <div class="col-5">
              <div class="form-group">
                <label
                  :class="{'text-danger': $v.title.$anyError}"
                  for="title"
                >Tytuł</label>
                <input
                  type="text"
                  :class="{'is-invalid': $v.title.$anyError}"
                  class="form-control "
                  id="title"
                  placeholder="Wprowadź tytuł"
                  v-model.trim="$v.title.$model"
                >
                <small
                  class="text-danger"
                  v-if="$v.title.$anyError"
                >Wymagane</small>
              </div>
            </div>
            <div class="col-2"><button
                style="margin-top:32px"
                class="btn btn-info"
                @click="getBooks(false)"
              >Szukaj</button>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              Znalezionych: {{totalitems}}
            </div>
          </div>
          <div
            v-for="book in books"
            :key="book.id"
            class="onebook"
          >
            <img
              :src="ifimage(book.volumeInfo) "
              class="bookphoto"
            >
            <div>
              Tytuł: {{book.volumeInfo.title}}
            </div>
            <div
              class="description"
              v-if="book.volumeInfo.description"
            >
              Opis: {{book.volumeInfo.description}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      title: "",
      books: [],
      totalitems: 0,
      skip: 0,
      load: true
    };
  },
  methods: {
    getBooks(more) {
      if (this.$v.$invalid == true) {
        this.$v.$touch();
      } else {
        let query = "volumes?q=";
        if (more == false) {
          this.load = true;
          this.skip = 0;
        }
        query += "intitle:" + this.title;
        query += "&maxResults=40";
        query += "&startIndex=" + this.skip;
        this.$http.get(query).then(response => {
          this.totalitems = response.body.totalItems;
          if (more == true) {
            if (response.body.items) {
              this.books = this.books.concat(response.body.items);
            } else {
              this.load = false;
            }
          } else {
            this.books = response.body.items;
          }
        });
      }
    },
    ifimage(book) {
      if (book.imageLinks) {
        return book.imageLinks.thumbnail;
      } else {
        return "/img/no_foto.png";
      }
    },
    handleScroll(event) {
      if (this.wait) {
        clearTimeout(this.wait);
      }
      this.wait = setTimeout(() => {
        var scrollHeight, totalHeight;
        scrollHeight = document.body.scrollHeight;
        totalHeight = window.scrollY + window.innerHeight;

        if (
          totalHeight >= scrollHeight &&
          this.books.length > 0 &&
          this.load == true
        ) {
          this.skip += 40;
          this.getBooks(true);
        }
      }, 500);
    }
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  validations: {
    title: {
      required
    }
  }
};
</script>
<style>
body {
  background-color: rgba(223, 223, 223, 0.74) !important;
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.6) 100%,
      rgba(0, 0, 0, 0.6) 100%
    ),
    url("/img/books.jpeg");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: right top;
  background-attachment: fixed;
}
.onebook {
  width: 25%;
  display: inline-table;
  text-align: center;
}
.bookphoto {
  max-width: 70%;
  margin: auto;
  margin-top: 0;
  display: block;
  border: 1px solid rgba(128, 128, 128, 0.377);
}
.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 5em;
}
</style>
