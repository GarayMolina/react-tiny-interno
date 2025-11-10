import React, { useRef, useEffect, useState } from 'react'

const EditorWord = ({ value, handleChange }) => {
    const editorRef = useRef(null)
    const fileInputRef = useRef(null)
    const [formatosActivos, setFormatosActivos] = useState({
        bold: false,
        italic: false,
        underline: false
    })
    const [imagenSeleccionada, setImagenSeleccionada] = useState(null)
    const [zoom, setZoom] = useState(100)

    // Tamaño máximo de imágenes
    const MAX_ANCHO = 1078
    const MAX_ALTO = 607

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.style.transform = `scale(${zoom / 100})`
            editorRef.current.style.transformOrigin = 'top left'
            editorRef.current.style.width = '100%'
            editorRef.current.style.maxWidth = '100%'
        }
    }, [zoom])

    const verificarFormatos = () => {
        if (!editorRef.current) return

        const esNegrita = document.queryCommandState('bold')
        const esCursiva = document.queryCommandState('italic')
        const esSubrayado = document.queryCommandState('underline')

        setFormatosActivos({
            bold: esNegrita,
            italic: esCursiva,
            underline: esSubrayado
        })
    }

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value
        }
    }, [value])

    useEffect(() => {
        const manejarClicEnImagen = (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault()
                setImagenSeleccionada(e.target)
            } else {
                setImagenSeleccionada(null)
            }
        }

        document.addEventListener('click', manejarClicEnImagen)
        return () => document.removeEventListener('click', manejarClicEnImagen)
    }, [])

    const redimensionarImagen = (img, ancho, alto) => {
        const nuevoAncho = Math.min(ancho, MAX_ANCHO)
        const nuevoAlto = Math.min(alto, MAX_ALTO)

        img.style.width = `${nuevoAncho}px`
        img.style.height = `${nuevoAlto}px`
        handleChange(editorRef.current.innerHTML)
    }

    const aplicarFormato = (comando, valor = null) => {
        editorRef.current.focus()
        document.execCommand(comando, false, valor)
        handleChange(editorRef.current.innerHTML)
        setTimeout(verificarFormatos, 10)
    }

    const insertarImagen = (e) => {
        e.preventDefault()
        editorRef.current.focus()
        fileInputRef.current.click()
    }

    const manejarImagen = (e) => {
        const archivo = e.target.files[0]
        if (!archivo?.type.match('image.*')) return

        const lector = new FileReader()
        lector.onload = (evento) => {
            const img = new Image()
            img.onload = function () {
                const anchoOriginal = this.width
                const altoOriginal = this.height

                let anchoFinal = anchoOriginal
                let altoFinal = altoOriginal

                if (anchoOriginal > MAX_ANCHO) {
                    anchoFinal = MAX_ANCHO
                    altoFinal = (altoOriginal * MAX_ANCHO) / anchoOriginal
                }

                if (altoFinal > MAX_ALTO) {
                    altoFinal = MAX_ALTO
                    anchoFinal = (anchoOriginal * MAX_ALTO) / altoOriginal
                }

                const imgHTML = `
          <img src="${evento.target.result}" 
               style="width: ${anchoFinal}px; height: ${altoFinal}px; border: 2px solid transparent; border-radius: 4px; margin: 10px 0; cursor: pointer;" 
               data-original-width="${anchoOriginal}"
               data-original-height="${altoOriginal}" />
        `
                aplicarFormato('insertHTML', imgHTML)
            }
            img.src = evento.target.result
        }
        lector.readAsDataURL(archivo)
        e.target.value = ''
    }

    const insertarEnlace = (e) => {
        e.preventDefault()
        editorRef.current.focus()
        const url = prompt('Ingresa la URL:', 'https://')
        if (url) aplicarFormato('createLink', url)
    }

    const cambiarColor = (e) => {
        e.preventDefault()
        editorRef.current.focus()
        const color = prompt('Color (ej: red, blue, #ff0000):', '#3498db')
        if (color) aplicarFormato('foreColor', color)
    }

    const manejarInput = () => {
        handleChange(editorRef.current.innerHTML)
        verificarFormatos()
    }

    const manejarClickEditor = () => {
        verificarFormatos()
    }

    const manejarKeyUp = () => {
        verificarFormatos()
    }

    const aumentarZoom = () => {
        setZoom(prev => Math.min(prev + 25, 150))
    }

    const disminuirZoom = () => {
        setZoom(prev => Math.max(prev - 25, 75))
    }

    const resetZoom = () => {
        setZoom(100)
    }

    return (
        <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 0 20px rgba(0,0,0,0.1)',
            fontFamily: 'Arial, sans-serif',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                padding: '15px',
                background: '#f5f5f5',
                borderBottom: '1px solid #ddd',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                    <select
                        onChange={(e) => aplicarFormato('formatBlock', e.target.value)}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    >
                        <option value="p">Normal</option>
                        <option value="h1">Título 1</option>
                        <option value="h2">Título 2</option>
                        <option value="h3">Título 3</option>
                    </select>

                    <button
                        type="button"
                        onClick={() => aplicarFormato('bold')}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #ccc',
                            background: formatosActivos.bold ? '#3498db' : 'white',
                            color: formatosActivos.bold ? 'white' : 'black',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        N
                    </button>

                    <button
                        type="button"
                        onClick={() => aplicarFormato('italic')}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #ccc',
                            background: formatosActivos.italic ? '#3498db' : 'white',
                            color: formatosActivos.italic ? 'white' : 'black',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontStyle: 'italic'
                        }}
                    >
                        K
                    </button>

                    <button
                        type="button"
                        onClick={() => aplicarFormato('underline')}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #ccc',
                            background: formatosActivos.underline ? '#3498db' : 'white',
                            color: formatosActivos.underline ? 'white' : 'black',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        S
                    </button>

                    <button type="button" onClick={() => aplicarFormato('justifyLeft')} style={{ padding: '8px 12px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                        ⬅
                    </button>

                    <button type="button" onClick={() => aplicarFormato('justifyCenter')} style={{ padding: '8px 12px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                        ⬌
                    </button>

                    <button type="button" onClick={() => aplicarFormato('justifyRight')} style={{ padding: '8px 12px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                        ➡
                    </button>

                    <button type="button" onClick={() => aplicarFormato('insertUnorderedList')} style={{ padding: '8px 12px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                        • Lista
                    </button>

                    <button type="button" onClick={() => aplicarFormato('insertOrderedList')} style={{ padding: '8px 12px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                        1. Lista
                    </button>

                    <button type="button" onClick={insertarEnlace} style={{ padding: '8px 12px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                        🔗
                    </button>

                    <button type="button" onClick={insertarImagen} style={{ padding: '8px 12px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                        🖼️
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={manejarImagen}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />

                    <button type="button" onClick={cambiarColor} style={{ padding: '8px 12px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                        🎨
                    </button>

                    <button type="button" onClick={() => aplicarFormato('removeFormat')} style={{ padding: '8px 12px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                        🧹
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '5px 10px', borderRadius: '5px', border: '1px solid #ddd' }}>
                    <button
                        type="button"
                        onClick={disminuirZoom}
                        disabled={zoom === 75}
                        style={{
                            padding: '5px 10px',
                            background: zoom === 75 ? '#ccc' : '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: zoom === 75 ? 'not-allowed' : 'pointer'
                        }}
                        title="Alejar"
                    >
                        ➖
                    </button>

                    <span style={{ fontSize: '14px', fontWeight: 'bold', minWidth: '45px', textAlign: 'center' }}>
                        {zoom}%
                    </span>

                    <button
                        type="button"
                        onClick={aumentarZoom}
                        disabled={zoom === 150}
                        style={{
                            padding: '5px 10px',
                            background: zoom === 150 ? '#ccc' : '#2ecc71',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: zoom === 150 ? 'not-allowed' : 'pointer'
                        }}
                        title="Acercar"
                    >
                        ➕
                    </button>

                    <button
                        type="button"
                        onClick={resetZoom}
                        style={{ padding: '5px 10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                        title="Zoom 100%"
                    >
                        🔄
                    </button>
                </div>
            </div>

            <div style={{
                padding: '20px',
                background: '#f8f9fa',
                overflow: 'hidden',
                minHeight: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}>
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning={true}
                    onInput={manejarInput}
                    onClick={manejarClickEditor}
                    onKeyUp={manejarKeyUp}
                    style={{
                        minHeight: '300px',
                        width: '90%',
                        maxWidth: '900px',
                        padding: '40px',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        outline: 'none',
                        background: 'white',
                        caretColor: 'black',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        transition: 'transform 0.3s ease'
                    }}
                />
            </div>

            {imagenSeleccionada && (
                <ImageResizer
                    imagen={imagenSeleccionada}
                    onResize={(ancho, alto) => redimensionarImagen(imagenSeleccionada, ancho, alto)}
                    onClose={() => setImagenSeleccionada(null)}
                    maxAncho={MAX_ANCHO}
                    maxAlto={MAX_ALTO}
                />
            )}
        </div>
    )
}

// Componente interno para redimensionar imágenes
const ImageResizer = ({ imagen, onResize, onClose, maxAncho, maxAlto }) => {
    const [tamano, setTamano] = useState({
        ancho: parseInt(imagen.style.width) || imagen.naturalWidth,
        alto: parseInt(imagen.style.height) || imagen.naturalHeight
    })

    const manejarRedimension = (direccion, e) => {
        e.stopPropagation()
        e.preventDefault()

        const factor = direccion.includes('increase') ? 1.1 : 0.9

        let nuevoAncho = tamano.ancho * factor
        let nuevoAlto = tamano.alto * factor

        if (nuevoAncho > maxAncho) {
            nuevoAncho = maxAncho
            nuevoAlto = (tamano.alto * maxAncho) / tamano.ancho
        }

        if (nuevoAlto > maxAlto) {
            nuevoAlto = maxAlto
            nuevoAncho = (tamano.ancho * maxAlto) / tamano.alto
        }

        nuevoAncho = Math.max(50, nuevoAncho)
        nuevoAlto = Math.max(50, nuevoAlto)

        setTamano({ ancho: nuevoAncho, alto: nuevoAlto })
        onResize(nuevoAncho, nuevoAlto)
    }

    const restaurarTamanoOriginal = () => {
        const anchoOriginal = parseInt(imagen.getAttribute('data-original-width')) || imagen.naturalWidth
        const altoOriginal = parseInt(imagen.getAttribute('data-original-height')) || imagen.naturalHeight

        let anchoFinal = anchoOriginal
        let altoFinal = altoOriginal

        if (anchoOriginal > maxAncho) {
            anchoFinal = maxAncho
            altoFinal = (altoOriginal * maxAncho) / anchoOriginal
        }

        if (altoFinal > maxAlto) {
            altoFinal = maxAlto
            anchoFinal = (anchoOriginal * maxAlto) / altoOriginal
        }

        setTamano({ ancho: anchoFinal, alto: altoFinal })
        onResize(anchoFinal, altoFinal)
    }

    const estiloOverlay = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    }

    const estiloControles = {
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        textAlign: 'center',
        maxWidth: '400px'
    }

    return (
        <div style={estiloOverlay} onClick={onClose}>
            <div style={estiloControles} onClick={e => e.stopPropagation()}>
                <h3>Redimensionar Imagen</h3>
                <p>
                    Tamaño actual: {Math.round(tamano.ancho)} × {Math.round(tamano.alto)} px
                </p>
                <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>
                    Máximo permitido: {maxAncho} × {maxAlto} px
                </p>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '15px 0' }}>
                    <button
                        onClick={(e) => manejarRedimension('increase', e)}
                        disabled={tamano.ancho >= maxAncho || tamano.alto >= maxAlto}
                        style={{
                            padding: '10px 15px',
                            background: (tamano.ancho >= maxAncho || tamano.alto >= maxAlto) ? '#ccc' : '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: (tamano.ancho >= maxAncho || tamano.alto >= maxAlto) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        ➕ Agrandar
                    </button>
                    <button
                        onClick={(e) => manejarRedimension('decrease', e)}
                        style={{ padding: '10px 15px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        ➖ Achicar
                    </button>
                </div>

                <button
                    onClick={restaurarTamanoOriginal}
                    style={{ padding: '8px 12px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', margin: '5px' }}
                >
                    🔄 Tamaño óptimo
                </button>

                <div style={{ marginTop: '15px' }}>
                    <button
                        onClick={onClose}
                        style={{ padding: '8px 20px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditorWord