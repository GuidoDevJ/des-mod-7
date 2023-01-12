let URL =process.env.PORT || "http://localhost:3001"

export const state = {
    data:{
        user:{},
        pets:[],
        reportPet: {
			petName: null,
			img: null,
			lat: null,
			lng: null,
			state: false,
			petId: null,
			ubication: null,
		},
    },
    listeners:[],

    initLocalStorage() {
		const dataUser: Storage = JSON.parse(localStorage.getItem('dataUser') as any);

		if (dataUser === null) {
			return;
		} else {
			this.setUserData(dataUser);
		}
	},

    clearLocalStorage() {
		localStorage.removeItem('dataUser');
	},

	getState() {
		return this.data;
	},

	getUserData() {
		return this.getState().user;
	},

	getReportPet() {
		return this.getState().reportPet;
	},

	suscribe(callback: (any) => any): void {
		this.listeners.push(callback);
	},

    setState(newState): void {
		this.data = newState;
		for (const cb of this.listeners) {
			cb();
		}
	},

	// Limpiar todos los datos del user del state
	cleanUserData(){
		let cs = this.getState()
		cs.user={}
		cs.reportPet = {
			petName: null,
			img: null,
			lat: null,
			lng: null,
			founded: false,
			petId: null,
			ubication: null,
		}
		this.setState(cs)
	},

	// Establecer los datos del usuario en el localStorage
    setUserDataLocalStorage() {

		const userData = this.getUserData();
		userData
			? localStorage.setItem('dataUser', JSON.stringify(userData))
			: console.error(`Missing userData in setUserDataLocalStorage`);
	},
    setPetDataLocalStorage() {

		const petData = this.getReportPet();
		petData
			? localStorage.setItem('dataPet', JSON.stringify(petData))
			: console.error(`Missing petData in setPetDataLocalStorage`);
	},

	// Declarar los datos del usuario
    setUserData(userData){
        const cs = this.getState()
        if(userData.name){
            cs.user.name = userData.name
            this.setState(cs)
            this.setUserDataLocalStorage()
        }if (userData.email) {
			cs.user.email = userData.email;
			this.setState(cs);
			this.setUserDataLocalStorage();
		}
		if (userData.token) {
			cs.user.token = userData.token;
			this.setState(cs);
			this.setUserDataLocalStorage();
		}
		if (userData.lat && userData.lng) {
			cs.user.lat = userData.lat;
			cs.user.lng = userData.lng;
			this.setState(cs);
			this.setUserDataLocalStorage();
		}
    },

	// Declarar los datos del pet
	setReportPet (obj){
		const {petName,img,lat,lng,state,petId} = obj
		let cs = this.getState()
		let datos = cs.reportPet
		if(petName){
			datos.petName = petName
			this.setState(cs)
			this.setPetDataLocalStorage()
		}
		if(img){
			datos.img = img
			this.setState(cs)
			this.setPetDataLocalStorage()
			
		}
		if(lat){
			datos.lat = lat
			this.setState(cs)
			this.setPetDataLocalStorage()
			
		}
		if(lng){
			datos.lng = lng
			this.setState(cs)
			this.setPetDataLocalStorage()

			
		}
		if(state){
			datos.state = state
			this.setState(cs)
			this.setPetDataLocalStorage()
			
		}
		if(petId){
			datos.petId = petId
			this.setState(cs)
			this.setPetDataLocalStorage()
			
		}
	},

	// Crear Usuario
	async createUser (email:string,name:string,password:string){
		this.setUserData({email,name})
		try {
			await fetch(`${URL}/auth`,{
				method:"post",
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({email,name,password})
			})
		} catch (error) {
			console.log("Error" + error)
			
		}
		
	},

	// Obtener Token
	async authUser(email,password){
		try {
		const res = await fetch(`${URL}/auth/token`,{
			method:"post",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({email,password})
		})
		const token = await res.json()
		this.setUserData({token:token.token})
		return token
		} catch (error) {
			return error
		}
	},

	// Traer usuario mediante el id
	async getUserById(id){ 
		const cs = this.getState()
		const user = this.getUserData()
		const token = user.token

			try {
				let res = await fetch(`${URL}/getUser/${id}`,{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + token
					}
				})
				let datos =await res.json()
				return datos
			} catch (error) {
				return error
			}
	 },

	//  Traer informacion del usuario de la base de datos
	async getUserDataFromDb(){
		const user = this.getUserData()
		let localstorage = JSON.parse(localStorage.getItem("dataUser"))
		let tokenStorage = localstorage.token
		const token = user.token 
		try {
			const res = await fetch(`${URL}/me`,{
				method:"get",
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + tokenStorage
				}
			})
			const datos = await res.json()
			const {name,email} = datos
			this.setUserData({name,email})
			return true
		} catch (error) {
			return false
		}
	},

	// Modificar datos del usuario en la base de datos
	async updateDataUser(data){
		const user = this.getUserData()
		const token = user.token
		if(data.name){
			this.setUserData(data)
		}
		if(data.email){
			this.setUserData(data)
		}
		try {
			const res = await fetch(`${URL}/updateUser`,{
				method:"put",
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token
				},
				body:JSON.stringify(data)
			})
			return res
		} catch (error) {
			console.log(error)
		}
	},

	// Modificar contraseña
	 async updatePassword(data){
		const user = this.getUserData()
		const token = user.token
		
		try {
			const res = await fetch(`${URL}/updatepassword`,{
				method:"put",
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token
				},
				body:JSON.stringify(data)
			})
			return res
		} catch (error) {
			console.log(error)
		}
	 },

	//  Subir imagen a Cloudynari
	 async uploadImage(data){
		const user = this.getUserData()
		const token = user.token
		try {
			const res = await fetch(`${URL}/uploadimage`,{
				method:"post",
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token
				},
				body:JSON.stringify(data)
			})
			let url = res.json()
			return url
		} catch (error) {
			console.log(error)
		}
	 },

	// Creacion del pet en Algolia
	 async createPetAlgoliaDb(data){
		const user = this.getUserData()
		const token = user.token
		try {
			let res = await fetch(`${URL}/createPetAlgolia`,{
				method:"post",
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token
				},
				body:JSON.stringify(data)
			})
			return res.json()
		} catch (error) {
			return error
		}
	
	 },

	//  Creacion del pet en la base de datos
	 async createPetDb(data){
		const user = this.getUserData()
		const token = user.token
		try {
			let res = await fetch(`${URL}/createPetDb`,{
				method:"post",
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token
				},
				body:JSON.stringify(data)
			})
			
			return await res.json()
		} catch (error) {
			return error
		}
	
	 },

	//  Obtener un pet por id
	 async getPetById(id){ 
		const cs = this.getState()
		const user = this.getUserData()
		const token = user.token

			try {
				let res = await fetch(`${URL}/getPet/${id}`,{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + token
					}
				})
				let datos =await res.json()
				return datos
			} catch (error) {
				return error
			}
	 },

	//  Obtener pets cercanos
	 async getAllPetsUserMe(){
		const cs = this.getState()
		const user = this.getUserData()
		const token = user.token
		if(token){
			try {
				let res = await fetch(`${URL}/getPetsUserMe`,{
					headers: {
					'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + token
					}
				})
				let datos =await res.json()
				cs.pets = datos
			} catch (error) {
				await this.getAllPetsUserMe()

				return error
			}
		}else{
			await this.getAllPetsUserMe()
		}
		
	 },

	//  Modificar los datos del pet en algolia

	 async updatePetDataDb(obj){
		let cs = this.getState()
		let petData = this.getReportPet()
		let token = cs.user.token
		let petId = petData.petId
		try {
			let res = await fetch(`${URL}/updatePetDb/${petId}`,{
				method:"put",
				headers:{
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token
				},
				body:JSON.stringify(obj)
			})
			return res
		} catch (error) {
			return error
		}
	 },
	//  Modificar los datos del pet en algolia
	 async updatePetDataAlgolia(obj){
		let cs = this.getState()
		let petData = this.getReportPet()
		let token = cs.user.token
		let petId = petData.petId
		try {
			let res = await fetch(`${URL}/updatePetAlgolia/${petId}`,{
				method:"put",
				headers:{
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token
				},
				body:JSON.stringify(obj)
			})
			return await res.json()
		} catch (error) {
			return error
		}
	 },
	//  Eliminar el pet de algolia y la base de datos
	 async deletePet(){
		let cs = this.getState()
		let petData = this.getReportPet()
		let token = cs.user.token
		let petId = petData.petId
		try {
			let petiAlgolia = await fetch(`${URL}/deletePetAlgolia/${petId}`,{
				method:"delete",
				headers:{
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token
				},
			})
			let resAlgolia = await petiAlgolia.json()
			let petiDb = await fetch(`${URL}/deletePetDb/${petId}`,{
				method:"delete",
				headers:{
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token
				},
			})
			let resDb = await petiDb.json()
			return {resDb,resAlgolia}
		} catch (error) {
			return error
		}
	 },
	//  Obtener a todos los pets cercanos
	 async getAllPetsNear (lat,lng){
		let csUser = this.getUserData()
		let token = csUser.token
	
		try {
			let result = await fetch(`${URL}/pets-cerca-de?lat=${lat}&lng=${lng}`,{
				method:"get",
				headers:{
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token
				},
			})
			return await result.json()
		} catch (error) {
			return error
		}
	 },

	// Enviar el email
	 async sendEmail(info){
		let csUser = this.getUserData()
		let token = csUser.token
		try {
			let result = await fetch(`${URL}/sendemail`,{
				method:"post",
				headers:{
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token
				},
				body:JSON.stringify(info)
			})
			return await result.json()
		} catch (error) {
			return error
		}
	 }


}