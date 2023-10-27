export default class UploadAdapter {
    constructor(loader, type) {
        this.loader = loader
        this.type = type
    }

    upload() {
        return this.loader.file.then(
            (file) =>
                new Promise((resolve, reject) => {
                    this.initRequest(file, resolve, reject)
                }),
        )
    }

    async initRequest(file, resolve, reject) {
        try {
            resolve({
                default: 'https://us-dev-product-service.s3.us-west-2.amazonaws.com/video/main_loopping/1_Trusted_ingredients_unprecedented_results.mp4',
            })
        } catch (e) {
            alert('이미지 전송 중 오류가 발생했습니다.')
            reject()
        }
    }
}
