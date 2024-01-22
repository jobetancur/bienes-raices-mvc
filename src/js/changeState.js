(function () {
    let changeStateButton = document.querySelectorAll('.change-state-button');
    const token = document.querySelector('meta[name="csrf-token"]').content;

    changeStateButton.forEach( button => {
        button.addEventListener('click', changeStateRealEstate);
    });

    async function changeStateRealEstate (e){
        const id = e.target.dataset.propiedadId

        try {
            const url = `/mis-propiedades/${id}`;

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'CSRF-Token': token,
                },
            });

            const {result} = await response.json();
            
            if(result) {
                if(e.target.classList.contains('bg-yellow-400')){
                    e.target.classList.add('bg-green-400', 'text-green-800');
                    e.target.classList.remove('bg-yellow-400', 'text-yellow-800');
                    e.target.textContent = 'Publicado';
                } else if (e.target.classList.contains('bg-green-400')) {
                    e.target.classList.add('bg-yellow-400', 'text-yellow-800');
                    e.target.classList.remove('bg-green-400', 'text-green-800');
                    e.target.textContent = 'No publicado';
                }
            }

        } catch (error) {
            console.log(error);   
        }
        
    }



}) ();