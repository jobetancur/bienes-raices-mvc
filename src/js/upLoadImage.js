import { Dropzone } from 'dropzone';

// .image hace referecia al id del formulario #image.
Dropzone.options.image = {
    dictDefaultMessage: 'Carga tus imagenes aquí',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5, // En MB
    maxFiles: 1, // Para que solo se suba una imagen.
    parallelUploads: 1, // Para que se suba una imagen a la vez.
    autoProcessQueue: false, // Para que no se suba la imagen automáticamente.
    addRemoveLinks: true, // Para que se muestre el link de eliminar imagen.
    dictRemoveFile: 'Eliminar imagen', // Para cambiar el texto del link de eliminar imagen.
    dictMaxFilesExceeded: 'Solo puedes subir una imagen', // Para cambiar el texto de maxFiles.
    headers: {
        'CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
    },
    paramName: 'image', // Nombre del input file.
    init: function() { // Función que se ejecuta cuando se inicializa el dropzone.
        const dropzone = this;
        const publishButton = document.querySelector('#publish-button');
        // Cuando se agrega una imagen, se ejecuta el evento success.
        publishButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (dropzone.getQueuedFiles().length > 0) {
                dropzone.processQueue();
            } else {
                document.querySelector('#image').parentNode.submit();
            }
        });
        dropzone.on('queuecomplete', function() {
            if(dropzone.getActiveFiles().length === 0) {
                window.location.href = '/mis-propiedades';
            }
        });
        
    }
}

