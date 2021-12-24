<template>
  <div class="hello">
    <input id="newpic" accept="image/*" type="file" style="display: none" >

    <input id="hr" accept="image/*" type="file" style="display: none" >
    <input id="multiplepic" multiple accept="image/*" type="file" style="display: none" >

    <div class="top">
      <div class="hr">
        <div>
          <el-button size="default" @click="uploadhr">上传原图</el-button>
          <el-button
            type="primary"
            size="default"
            @click="startCrop"
          >画框</el-button
          >

          <div
            :style="{
              width: imgsize.width + 'px',
              height: imgsize.height + 'px',
            }"
          >
            <vueCropper
              v-if="imgsize.width"
              ref="cropper"
              :auto-crop="true"
              :output-type="option.outputType"
              :can-scale="false"
              :fixed="true"
              :center-box="true"
              :img="hr || 'static/source.png'"
              @realTime="realTime"
            />
          </div>
        </div>
      </div>

      <div class="addnew">
        <div>
          <el-button
            size="default"
            @click="dialog.showaddform = true"
          >上传结果图</el-button
          >
          <el-button
            size="info"
            @click="uploadmultiple"
          >多文件上传结果图</el-button
          >
        </div>
      </div>
    </div>
    <div class="middle">
      <div v-for="(p, k) in rows" :key="k" class="row">
        <div>
          <div class="title">
            <el-button type="text" size="default">{{ p.title }}</el-button>
            <el-button
              type="text"
              size="default"
              icon="el-icon-delete"
              @click="removepic(k)"
            />
          </div>
          <div>
            <img :src="p.img" alt="" style="width: 100%; margin-top: 8px" >
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="bottom_row" >
        <section class="pre-item" title="">
          <p>HR</p>
          <div id="cp1" :style="previewStyle3">
            <div :style="previews.div">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </section>
        <section v-for="(p,k) in rows" :key="k" class="pre-item" title="">
          <p>{{ p.title }}
            <span v-if="p.loading && !p.metrics">{{ '请稍等..' }}</span>
          <el-button v-else type="primary" size="mini" @click="getmetrics(p)" >指标</el-button></p>
          <div :style="previewStyle3">
            <div :style="previews.div">
              <img :style="previews.img" :src="p.img||'static/pesr.png'">

            </div>
          </div>
          <div v-if="p.metrics" style="font-size:7px;">
            <p>PI/{{ p.metrics.PI }}</p>
            <p>PSNR/{{ p.metrics.PSNR }}</p>
            <p>SSIM/{{ p.metrics.SSIM }}</p>
            <p>LPIPS/{{ p.metrics.LPIPS }}</p>
          </div>
        </section>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialog.showaddform"
      title="上传结果图"
      width="30%"
    >
      <el-form :inline="false" label-width="80px" size="normal">
        <el-form-item label="算法名称">
          <el-input v-model="addform.title" />
        </el-form-item>
        <el-form-item v-if="addform.title">
          <el-button type="primary" @click="uploadnewpic">上传结果图</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import { getimagesize, getmetrics } from './function'
export default {
  name: 'HelloWorld',
  components: {
    VueCropper
  },
  data() {
    return {
      imgsize: { width: '', height: '' },
      option: {
        outputType: 'png'
      },
      dialog: {
        showaddform: false

      },
      addform: {
        title: '',
        img: ''
      },
      hr: '', // 原图url
      rows: [], // 算法列表
      previews: {},
      previewStyle3: {}
    }
  },
  mounted() {
    const app = this
    document.getElementById('hr').addEventListener('change', (e) => {
      const file = e.target.files[0]
      // console.log('e', e)
      var reader = new FileReader()
      reader.onload = function(e) {
        app.hr = e.target.result

        getimagesize(app.hr).then((imgsize) => {
          app.imgsize = {
            width: imgsize.width + 0,
            height: imgsize.height + 0
          }
          // setTimeout(function() {
          //   app.$refs.cropper.startCrop()
          // }, 1000)
        })
        // setTimeout(function() {
        //   app.$refs.cropper.startCrop()
        // }, 1000)
      }
      reader.readAsDataURL(file)
    })
    document.getElementById('newpic').addEventListener('change', (e) => {
      const file = e.target.files[0]
      var reader = new FileReader()
      reader.onload = function(e) {
        app.addform.img = e.target.result
        app.dialog.showaddform = false
        app.rows.push(Object.assign({ loading: false, metrics: '' }, app.addform))
        app.addform = { title: '', img: '' }
      }
      reader.readAsDataURL(file)
    })

    document.getElementById('multiplepic').addEventListener('change', (e) => {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i]

        var reader = new FileReader()
        reader.onload = function(e) {
          const img = e.target.result

          app.rows.push({ loading: false, metrics: '', title: file.name, img })
        }
        reader.readAsDataURL(file)
      }
    })
  },

  methods: {
    async     getmetrics(p) {
      p.loading = true
      const app = this
      const srbase64 = p.img
      const hr = app.hr
      // console.log(srbase64, hr)
      const result = await getmetrics(hr, srbase64)
      // console.log(result)
      p.metrics = result
      return result
    },
    startCrop() {
      this.$refs.cropper.stopCrop()
      this.$refs.cropper.clearCrop()
      this.$refs.cropper.startCrop()
    },
    realTime(data) {
      var previews = data

      this.previewStyle3 = {
        width: previews.w + 'px',
        height: previews.h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: (200 / previews.w)
      }

      this.previews = data
    },
    removepic(p) {
      this.rows.splice(p, 1)
    },
    uploadhr() {
      document.getElementById('hr').click()
    },
    uploadnewpic() {
      document.getElementById('newpic').click()
    },
    uploadmultiple() {
      document.getElementById('multiplepic').click()
    }
  }
}
</script>
<style>
body,
html,
* {
  padding: 0;
  margin: 0;
}
.cropper-view-box {
  outline-color: rgb(255, 0, 0) !important;
}
.crop-info {
  display: none !important;
}
.crop-point,
.cropper-modal {
  display: none !important;
}
</style>
<style scoped>
.hello {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.top,
.middle,
.bottom {
  display: flex;
}
.hr,
.row,
.addnew,
.middle_row,
.bottom_row {
  flex: 1;
  padding: 4px;
  margin: 4px;
  border: 1px dashed #ccc;
  text-align: center;
}
.bottom_row{
  display: flex;
  flex-wrap: wrap;
}
.cropper-face {
  opacity: 0 !important;
}
.pre {
  display: flex;
  flex-wrap: wrap;
}
.pre-item {
  padding-right: 20px;
}
.index_bg {
  width: 400px;
  height: 400px;
}
.cp {
  position: absolute;
  top: 100px;
  left: 500px;
  width: 300px;
  height: 300px;
}
.cp img {
  width: 100%;
}
.cp1 {
  width: 200px;
  height: 200px;
}
.cp1 img {
  width: 100%;
}
.hr {
  min-width: 400px;
  min-height: 400px;
}
.index_bg {
  width: 600px;
  height: 600px;
}
</style>
