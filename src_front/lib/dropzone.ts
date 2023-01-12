import Dropzone from "dropzone";
const activateDropzone = (container) => {
  return new Dropzone(`.${container}`, {
    url: "/falsa",
    maxFilesize: 1,
    maxFiles: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    acceptedFiles: ".png, .jpg",
    dictDefaultMessage: "Click aqui para subir tu imagen",
    dictRemoveFile: "Eliminar",
    thumbnailWidth: 1000,
    thumbnailHeight: 1000,
    init: function () {
      this.on("error", function (file, message) {
        alert(message);
        this.removeFile(file);
      });
    },
  });
};
export {activateDropzone}