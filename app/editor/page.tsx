'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Rnd } from 'react-rnd';
import { error } from 'console';
import React from 'react';
import { HiOutlineLightBulb } from 'react-icons/hi';

type StyleSuggestion = {
    description: string;
    css: string;
    tone: string;
};

import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    NotebookPen,
    TextCursor,
    ImageIcon,
    HomeIcon,
} from 'lucide-react';
import { FaShareSquare } from 'react-icons/fa';

type Collaborator = { initials: string; [key: string]: any };

type BuilderElement = {
    fontSize: string;
    fontFamily: string;
    textColor: string;
    id: string;
    type: 'text' | 'image' | 'gif'; // <-- Ajoute "gif"
    x: number;
    y: number;
    width: number;
    height: number;
    content?: string;
    src?: string;
    customStyle?: string;
    rotation?: number; // <-- Ajouté pour la rotation
    backgroundColor?: string; // <-- Ajouté pour le fond de l'élément
};

// Fonction utilitaire pour convertir camelCase en kebab-case
function camelToKebab(str: string) {
    return str.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
}

// Nouvelle version des templates de disposition avec aperçu visuel façon Canva
const layoutTemplates = [
    {
        name: 'Titre centré + image dessous',
        apply: (elements: BuilderElement[]) => {
            let y = 40;
            return elements.map((el, i) => {
                if (i === 0 && el.type === 'text') {
                    return { ...el, x: 250, y, width: 300, height: 60 };
                }
                if (i === 1 && (el.type === 'image' || el.type === 'gif')) {
                    return { ...el, x: 300, y: 120, width: 200, height: 200 };
                }
                return el;
            });
        },
        preview: [
            {
                x: 20,
                y: 8,
                width: 48,
                height: 12,
                color: '#c7d2fe',
                label: 'Titre',
            },
            {
                x: 30,
                y: 28,
                width: 32,
                height: 24,
                color: '#fbbf24',
                label: 'Image',
            },
        ],
    },
    {
        name: '2 colonnes',
        apply: (elements: BuilderElement[]) => {
            return elements.map((el, i) => ({
                ...el,
                x: i % 2 === 0 ? 80 : 420,
                y: 60 + Math.floor(i / 2) * 180,
                width: 300,
                height: 120,
            }));
        },
        preview: [
            {
                x: 8,
                y: 12,
                width: 28,
                height: 32,
                color: '#fbbf24',
                label: 'Bloc',
            },
            {
                x: 44,
                y: 12,
                width: 28,
                height: 32,
                color: '#c7d2fe',
                label: 'Bloc',
            },
        ],
    },
    {
        name: 'Liste verticale',
        apply: (elements: BuilderElement[]) => {
            return elements.map((el, i) => ({
                ...el,
                x: 250,
                y: 40 + i * 120,
                width: 300,
                height: 80,
            }));
        },
        preview: [
            {
                x: 20,
                y: 6,
                width: 40,
                height: 10,
                color: '#fbbf24',
                label: 'Bloc',
            },
            {
                x: 20,
                y: 20,
                width: 40,
                height: 10,
                color: '#c7d2fe',
                label: 'Bloc',
            },
            {
                x: 20,
                y: 34,
                width: 40,
                height: 10,
                color: '#fbbf24',
                label: 'Bloc',
            },
        ],
    },
];

export default function AdvancedEditor() {
    const { user } = useUser();
    const router = useRouter();
    const editorRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [docData, setDocData] = useState<{
        title: string;
        content: string;
        tone: string;
        format: string;
        style: string;
        fontFamily: string;
        fontSize: string;
        textColor: string;
        backgroundColor: string;
        lineHeight: string;
        textAlign: string;
        elements: BuilderElement[];
    }>({
        title: '',
        content: '',
        tone: 'neutral',
        format: 'normal',
        style: '',
        fontFamily: 'Arial',
        fontSize: '16px',
        textColor: '#000000',
        backgroundColor: '#ffffff',
        lineHeight: '1.5',
        textAlign: 'left',
        elements: [],
    });

    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [activeToolbar, setActiveToolbar] = useState<
        'text' | 'format' | 'insert' | 'bold' | 'italic' | null
    >(null);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAILoading, setIsAILoading] = useState(false);
    const [styleSuggestions, setStyleSuggestions] = useState<StyleSuggestion[]>(
        []
    );
    const [showStyleSuggestions, setShowStyleSuggestions] = useState(false);
    const [showFontPicker, setShowFontPicker] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [currentColorType, setCurrentColorType] = useState<
        'text' | 'background' | null
    >(null);
    const [showInsertMenu, setShowInsertMenu] = useState(false);

    // GIF search states
    const [showGifSearch, setShowGifSearch] = useState(false);
    const [gifResults, setGifResults] = useState<string[]>([]);
    const [gifQuery, setGifQuery] = useState('');
    const [isGifLoading, setIsGifLoading] = useState(false);

    // Pour stats
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    // Options
    const fontOptions = [
        'Arial',
        'Verdana',
        'Helvetica',
        'Times New Roman',
        'Courier New',
        'Georgia',
        'Palatino',
        'Garamond',
        'Comic Sans MS',
        'Impact',
        'Lucida Sans',
        'Tahoma',
    ];
    const fontSizeOptions = [
        '8px',
        '10px',
        '12px',
        '14px',
        '16px',
        '18px',
        '20px',
        '24px',
        '28px',
        '32px',
        '36px',
        '42px',
        '48px',
    ];
    const lineHeightOptions = ['1', '1.15', '1.5', '2', '2.5'];
    const textAlignOptions = [
        { value: 'left', icon: AlignLeft },
        { value: 'center', icon: AlignCenter },
        { value: 'right', icon: AlignRight },
        { value: 'justify', icon: AlignJustify },
    ];
    const toneOptions = [
        { value: 'happy', label: 'Heureux', type: 'mood' },
        { value: 'sad', label: 'Triste', type: 'mood' },
        { value: 'angry', label: 'En colère', type: 'mood' },
        { value: 'melancholic', label: 'Mélancolique', type: 'mood' },
        { value: 'romantic', label: 'Romantique', type: 'mood' },
        { value: 'anxious', label: 'Anxieux', type: 'mood' },
        { value: 'hopeful', label: 'Optimiste', type: 'mood' },
        { value: 'nostalgic', label: 'Nostalgique', type: 'mood' },
        { value: 'dramatic', label: 'Dramatique', type: 'mood' },
        { value: 'mysterious', label: 'Mystérieux', type: 'mood' },
        { value: 'grateful', label: 'Reconnaissant', type: 'mood' },
        { value: 'sarcastic', label: 'Sarcastique', type: 'mood' },
        { value: 'ironic', label: 'Ironique', type: 'mood' },
        { value: 'despairing', label: 'Désespéré', type: 'mood' },
        { value: 'playful', label: 'Joueur', type: 'mood' },
        { value: 'whimsical', label: 'Capricieux', type: 'mood' },
    ];

    const formatOptions = [
        { value: 'normal', label: 'Normal' },
        { value: 'heading1', label: 'Titre 1' },
        { value: 'heading2', label: 'Titre 2' },
        { value: 'heading3', label: 'Titre 3' },
        { value: 'bullet', label: 'Liste à puces' },
        { value: 'numbered', label: 'Liste numérotée' },
        { value: 'quote', label: 'Citation' },
    ];
    const colorPalette = [
        '#000000',
        '#434343',
        '#666666',
        '#999999',
        '#b7b7b7',
        '#cccccc',
        '#d9d9d9',
        '#efefef',
        '#f3f3f3',
        '#ffffff',
        '#980000',
        '#ff0000',
        '#ff9900',
        '#ffff00',
        '#00ff00',
        '#00ffff',
        '#4a86e8',
        '#0000ff',
        '#9900ff',
        '#ff00ff',
        '#e6b8af',
        '#f4cccc',
        '#fce5cd',
        '#fff2cc',
        '#d9ead3',
        '#d0e0e3',
        '#c9daf8',
        '#cfe2f3',
        '#d9d2e9',
        '#ead1dc',
        '#dd7e6b',
        '#ea9999',
        '#f9cb9c',
        '#ffe599',
        '#b6d7a8',
        '#a2c4c9',
        '#a4c2f4',
        '#9fc5e8',
        '#b4a7d6',
        '#d5a6bd',
    ];

    useEffect(() => {
        const words = docData.content.trim()
            ? docData.content.trim().split(/\s+/).length
            : 0;
        setWordCount(words);
        setCharCount(docData.content.length);
    }, [docData.content]);

    const handleFormatChange = (format: string) => {
        setDocData({ ...docData, format });
        applyFormatting(format);
    };

    const applyFormatting = (format: string) => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        if (!selectedText) return;

        let newContent = docData.content;
        let formattedText = selectedText;

        switch (format) {
            case 'heading1':
                formattedText = `<h1 style="font-size: 24px; font-weight: bold;">${selectedText}</h1>`;
                break;
            case 'heading2':
                formattedText = `<h2 style="font-size: 20px; font-weight: bold;">${selectedText}</h2>`;
                break;
            case 'heading3':
                formattedText = `<h3 style="font-size: 18px; font-weight: bold;">${selectedText}</h3>`;
                break;
            case 'bullet':
                formattedText = `<ul><li>${selectedText}</li></ul>`;
                break;
            case 'numbered':
                formattedText = `<ol><li>${selectedText}</li></ol>`;
                break;
            case 'quote':
                formattedText = `<blockquote style="border-left: 3px solid #ccc; padding-left: 10px; margin-left: 0;">${selectedText}</blockquote>`;
                break;
            default:
                formattedText = selectedText;
        }

        newContent = newContent.replace(selectedText, formattedText);
        setDocData({ ...docData, content: newContent });

        // Mettre à jour l'éditeur
        if (editorRef.current) {
            editorRef.current.innerHTML = newContent;
        }
    };

    const handleSave = async () => {
        if (!docData.title.trim()) {
            toast.error('Un titre est requis');
            if (titleRef.current) titleRef.current.focus();
            return;
        }

        setLoading(true);
        try {
            // 1. Générer le HTML
            const escapeHtml = (unsafe: string) =>
                unsafe
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;')
                    .replace(/\n/g, '<br>');

            const styleObj = docData.style ? JSON.parse(docData.style) : {};
            const styleString = Object.entries(styleObj)
                .map(([k, v]) => `${camelToKebab(k)}:${v};`)
                .join('');

            // Ajoute le dessin comme image si présent
            let drawingImgHtml = '';
            if (canvasRef.current) {
                const drawingDataUrl = canvasRef.current.toDataURL();
                drawingImgHtml = `<img src="${drawingDataUrl}" style="position:absolute;left:0;top:0;width:800px;height:765px;pointer-events:none;z-index:999;" />`;
            }

            const html = `
       <div style="position:relative;margin:auto;width:800px;height:765px;background:#fff;${styleString}">
         ${drawingImgHtml}
         ${docData.elements
             .map((el) => {
                 let customStyle = '';
                 if (el.customStyle) {
                     try {
                         const parsed = JSON.parse(el.customStyle);
                         customStyle = Object.entries(parsed)
                             .map(([k, v]) => `${camelToKebab(k)}:${v};`)
                             .join('');
                     } catch {
                         customStyle = '';
                     }
                 }
                 const baseStyle = `
             position:relative;
             left:${el.x}px;top:${el.y}px;
             width:${el.width}px;height:${el.height}px;
             ${el.rotation ? `transform:rotate(${el.rotation}deg);` : ''}
             background:${el.backgroundColor || 'transparent'};
             font-size:${el.fontSize || '16px'};
             font-family:${el.fontFamily || 'Arial'};
             color:${el.textColor || '#000'};
             font-weight:500;
             ${customStyle}
           `;
                 if (el.type === 'text') {
                     return `<div style="${baseStyle}" >${escapeHtml(
                         el.content || ''
                     )}</div>`;
                 } else if (el.type === 'image' || el.type === 'gif') {
                     return `<img src="${el.src}" style="${baseStyle}" />`;
                 }
                 return '';
             })
             .join('')}
       </div>
     `;
            // 2. Uploader le HTML sur S3 via /api/upload
            const blob = new Blob([html], { type: 'text/html' });
            const formData = new FormData();
            // Utilise un File pour garantir le nom et le type
            const htmlFile = new File(
                [blob],
                `${docData.title || 'export'}.html`,
                { type: 'text/html' }
            );
            formData.append('file', htmlFile);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (!uploadRes.ok) throw new Error();
            const { filename } = await uploadRes.json();
            // Génère l'URL S3 (adapte selon ta config, ici bucket public)
            const s3Url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.amazonaws.com/${filename}`;
            // 3. Enregistre le post avec l'URL S3 comme content
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...docData, content: s3Url }),
            });
            if (!res.ok) throw new Error("Échec de l'enregistrement");
            const data = await res.json();
            const postId = data.post.id;
            // 4. Génère le lien de partage
            const shareRes = await fetch('/api/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId }),
            });
            if (!shareRes.ok) throw new Error('Échec de la génération du lien');
            const shareData = await shareRes.json();
            const generatedUrl = `${window.location.origin}/shared/${shareData.id}`;
            setShareUrl(s3Url);
            //setShareUrl(generatedUrl);
            toast.success('Document enregistré et partagé avec succès!');
        } catch (error) {
            console.error(error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Une erreur est survenue'
            );
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        toast.success('Lien copié!');
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === '#' && e.ctrlKey) {
            handleFormatChange('heading1');
            e.preventDefault();
        }
    };

    const getStyleSuggestions = async () => {
        setIsAILoading(true);
        try {
            const response = await fetch('/api/ai-style-suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: docData.content,
                    currentTone: docData.tone,
                    currentFormat: docData.format,
                }),
            });

            if (!response.ok)
                throw new Error('Échec de la récupération des suggestions');

            const data = await response.json();
            setStyleSuggestions(data.suggestions);
            setShowStyleSuggestions(true);
            toast.success('Suggestions de style générées!');
        } catch (error) {
            console.error(error);
            toast.error('Erreur lors de la génération des suggestions');
        } finally {
            setIsAILoading(false);
        }
    };

    const applyStyle = (css: string) => {
        setDocData((prev) => ({
            ...prev,
            style: css,
            elements: prev.elements.map((el) =>
                el.type === 'text' ? { ...el, customStyle: css } : el
            ),
        }));
        toast.success('Style appliqué!');
        setShowStyleSuggestions(false);
    };

    const handleFontChange = (font: string) => {
        setDocData({ ...docData, fontFamily: font });
        setShowFontPicker(false);
    };

    const handleFontSizeChange = (size: string) => {
        setDocData({ ...docData, fontSize: size });
    };

    const handleColorChange = (color: string) => {
        if (currentColorType === 'text') {
            setDocData({ ...docData, textColor: color });
        } else if (currentColorType === 'background') {
            setDocData({ ...docData, backgroundColor: color });
        }
        setShowColorPicker(false);
    };

    const handleTextAlign = (align: string) => {
        setDocData({ ...docData, textAlign: align });
    };

    const handleLineHeightChange = (height: string) => {
        setDocData({ ...docData, lineHeight: height });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newImages = [...images];
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    newImages.push(event.target.result as string);
                    setImages([...newImages]);

                    // Insérer l'image dans l'éditeur
                    if (editorRef.current) {
                        const img = document.createElement('img');
                        img.src = event.target.result as string;
                        img.style.maxWidth = '100%';
                        img.style.height = 'auto';

                        const selection = window.getSelection();
                        if (selection && selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            range.insertNode(img);
                            range.setStartAfter(img);
                            selection.removeAllRanges();
                            selection.addRange(range);

                            // Mettre à jour le contenu
                            setDocData({
                                ...docData,
                                content: editorRef.current?.innerHTML || '',
                            });
                        }
                    }
                }
            };
            reader.readAsDataURL(files[i]);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
        setShowInsertMenu(false);
    };

    const getEditorStyle = () => {
        return {
            fontFamily: docData.fontFamily,
            fontSize: docData.fontSize,
            color: docData.textColor,
            backgroundColor: docData.backgroundColor,
            lineHeight: docData.lineHeight,
            textAlign: docData.textAlign as
                | 'left'
                | 'center'
                | 'right'
                | 'justify',
            ...(docData.style ? JSON.parse(docData.style) : {}),
        };
    };

    useEffect(() => {
        if (docData.content.length > 30) {
            getStyleSuggestions();
        }
    }, [docData.content]);

    // Statistiques sur le texte (tous les éléments texte concaténés)
    useEffect(() => {
        const allText = docData.elements
            .filter((el) => el.type === 'text')
            .map((el) => el.content || '')
            .join(' ');
        const words = allText.trim() ? allText.trim().split(/\s+/).length : 0;
        setWordCount(words);
        setCharCount(allText.length);
    }, [docData.elements]);

    // Ajout d'un texte
    const addTextElement = () => {
        setDocData((prev) => ({
            ...prev,
            elements: [
                ...prev.elements,
                {
                    id: Date.now().toString(),
                    type: 'text',
                    x: 50,
                    y: 50,
                    width: 300,
                    height: 60,
                    content: 'Nouveau texte',
                    fontSize: prev.fontSize,
                    fontFamily: prev.fontFamily,
                    textColor: prev.textColor,
                },
            ],
        }));
    };

    // Ajout d'une image
    const addImageElement = (src: string) => {
        setDocData((prev) => ({
            ...prev,
            elements: [
                ...prev.elements,
                {
                    id: Date.now().toString(),
                    type: 'image',
                    x: 100,
                    y: 100,
                    width: 200,
                    height: 200,
                    src,
                    fontSize: prev.fontSize,
                    fontFamily: prev.fontFamily,
                    textColor: prev.textColor,
                },
            ],
        }));
    };

    // Ajout d'un GIF
    const addGifElement = (src: string) => {
        setDocData((prev) => ({
            ...prev,
            elements: [
                ...prev.elements,
                {
                    id: Date.now().toString(),
                    type: 'gif',
                    x: 120,
                    y: 120,
                    width: 200,
                    height: 200,
                    src,
                    fontSize: prev.fontSize,
                    fontFamily: prev.fontFamily,
                    textColor: prev.textColor,
                },
            ],
        }));
    };

    // Handler pour le file input du builder (image/gif)
    const handleBuilderImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type === 'image/gif') {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    addGifElement(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        } else {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    addImageElement(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Recherche de GIFs via Tenor v1
    const searchGifs = async (query: string) => {
        setIsGifLoading(true);
        setGifResults([]);
        try {
            const res = await fetch(
                `https://g.tenor.com/v1/search?q=${encodeURIComponent(
                    query
                )}&key=LIVDSRZULELA&limit=8`
            );
            const data = await res.json();
            const urls: string[] = [];
            for (const result of data.results) {
                const media = result.media && result.media[0];
                if (media && media.gif && media.gif.url) {
                    urls.push(media.gif.url);
                } else if (media && media.tinygif && media.tinygif.url) {
                    urls.push(media.tinygif.url);
                }
            }
            setGifResults(urls);
        } catch {
            toast.error('Erreur lors de la recherche de GIFs');
        }
        setIsGifLoading(false);
    };

    const updateElement = (idx: number, changes: Partial<BuilderElement>) => {
        setDocData((prev) => ({
            ...prev,
            elements: prev.elements.map((el, i) =>
                i === idx ? { ...el, ...changes } : el
            ),
        }));
    };

    // Nouvel état pour l'élément sélectionné
    const [selectedElementIdx, setSelectedElementIdx] = useState<number | null>(
        null
    );

    // Méthode pour sélectionner un élément
    const selectElement = (idx: number) => setSelectedElementIdx(idx);

    // Méthode pour faire pivoter l'élément sélectionné
    const rotateSelectedElement = (angle: number) => {
        if (selectedElementIdx === null) return;
        setDocData((prev) => ({
            ...prev,
            elements: prev.elements.map((el, i) =>
                i === selectedElementIdx
                    ? { ...el, rotation: (el.rotation || 0) + angle }
                    : el
            ),
        }));
    };

    // Méthode pour changer la couleur de fond de l'élément sélectionné
    const changeSelectedElementBg = (color: string) => {
        if (selectedElementIdx === null) return;
        setDocData((prev) => ({
            ...prev,
            elements: prev.elements.map((el, i) =>
                i === selectedElementIdx
                    ? { ...el, backgroundColor: color }
                    : el
            ),
        }));
    };

    // Méthode pour changer la couleur de police de l'élément sélectionné
    const changeSelectedElementTextColor = (color: string) => {
        if (selectedElementIdx === null) return;
        setDocData((prev) => ({
            ...prev,
            elements: prev.elements.map((el, i) =>
                i === selectedElementIdx ? { ...el, textColor: color } : el
            ),
        }));
    };

    // Méthode pour changer la taille de police de l'élément sélectionné
    const changeSelectedElementFontSize = (size: string) => {
        if (selectedElementIdx === null) return;
        setDocData((prev) => ({
            ...prev,
            elements: prev.elements.map((el, i) =>
                i === selectedElementIdx ? { ...el, fontSize: size } : el
            ),
        }));
    };

    // Ajoute la suppression d'un élément
    const deleteElement = (idx: number) => {
        setDocData((prev) => ({
            ...prev,
            elements: prev.elements.filter((_, i) => i !== idx),
        }));
        setSelectedElementIdx(null);
    };

    // --- FONCTIONNALITÉ DESSIN ---
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawColor, setDrawColor] = useState('#ff0000');
    const [drawSize, setDrawSize] = useState(4);
    const [drawingMode, setDrawingMode] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasData, setCanvasData] = useState<string | null>(null);

    // Gestion du dessin
    const handleStartDraw = (
        e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ) => {
        if (!drawingMode) return;
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!isDrawing || !drawingMode) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawSize;
        ctx.lineCap = 'round';
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const handleEndDraw = () => {
        if (!drawingMode) return;
        setIsDrawing(false);
        // Sauvegarde le dessin pour l'export
        const canvas = canvasRef.current;
        if (canvas) {
            setCanvasData(canvas.toDataURL());
        }
    };

    const handleClearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setCanvasData(null);
    };

    // Restaure le dessin si canvasData existe
    useEffect(() => {
        if (canvasData && canvasRef.current) {
            const img = new window.Image();
            img.onload = () => {
                const ctx = canvasRef.current!.getContext('2d');
                if (ctx) ctx.drawImage(img, 0, 0);
            };
            img.src = canvasData;
        }
    }, [canvasData]);

    // ...reste du code existant...

    // --- MODIFICATION EXPORT HTML POUR INCLURE LE DESSIN ---
    const handleExportHtml = () => {
        const escapeHtml = (unsafe: string) =>
            unsafe
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;')
                .replace(/\n/g, '<br>');

        const styleObj = docData.style ? JSON.parse(docData.style) : {};
        const styleString = Object.entries(styleObj)
            .map(([k, v]) => `${camelToKebab(k)}:${v};`)
            .join('');

        // Ajoute le dessin comme image si présent
        let drawingImgHtml = '';
        if (canvasRef.current) {
            const drawingDataUrl = canvasRef.current.toDataURL();
            drawingImgHtml = `<img src="${drawingDataUrl}" style="position:absolute;left:0;top:0;width:800px;height:765px;pointer-events:none;z-index:999;" />`;
        }

        const html = `
     <div style="position:relative;width:800px;height:765px;background:#fff;${styleString}">
       ${drawingImgHtml}
       ${docData.elements
           .map((el) => {
               let customStyle = '';
               if (el.customStyle) {
                   try {
                       const parsed = JSON.parse(el.customStyle);
                       customStyle = Object.entries(parsed)
                           .map(([k, v]) => `${camelToKebab(k)}:${v};`)
                           .join('');
                   } catch {
                       customStyle = '';
                   }
               }
               const baseStyle = `
           position:absolute;
           left:${el.x}px;top:${el.y}px;
           width:${el.width}px;height:${el.height}px;
           ${el.rotation ? `transform:rotate(${el.rotation}deg);` : ''}
           background:${el.backgroundColor || 'transparent'};
           font-size:${el.fontSize || '16px'};
           font-family:${el.fontFamily || 'Arial'};
           color:${el.textColor || '#000'};
           font-weight:500;
           ${customStyle}
         `;
               if (el.type === 'text') {
                   return `<div style="${baseStyle}" >${escapeHtml(
                       el.content || ''
                   )}</div>`;
               } else if (el.type === 'image' || el.type === 'gif') {
                   return `<img src="${el.src}" style="${baseStyle}" />`;
               }
               return '';
           })
           .join('')}
     </div>
   `;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${docData.title || 'export'}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col h-screen bg-[#191d1e]">
            {/* Header */}
            <header className="py-2 px-4 border-b border-gray-200  shadow-sm">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center gap-2 text-[#f1caad] font-semibold">
                            <NotebookPen size={20} />
                            <span className="uppercase">
                                Créer une page Page
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 max-w-2xl mx-4">
                        <input
                            ref={titleRef}
                            className="w-full text-lg font-normal px-2 py-1 border-b border-transparent hover:border-neutral-100 focus:border-[#f1caad] focus:outline-none text-white text-center uppercase"
                            placeholder="Titre de la page"
                            value={docData.title}
                            onChange={(e) =>
                                setDocData({
                                    ...docData,
                                    title: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-4 py-2 bg-[#f1caad] text-[#383e3f] rounded hover:bg-[#f1caad] uppercase focus:outline-none focus:ring-2 focus:ring-[#f1caad] flex items-center">
                            <span>Partager</span>
                            {loading ? (
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <FaShareSquare className="ml-2" size={20} />
                            )}
                        </button>
                        {/* <button
                        onClick={handleExportHtml}
                        className="px-3 py-1 bg-green-600 text-white rounded ml-2">
                        Exporter en HTML
                    </button> */}
                    </div>
                </div>
            </header>

            {/* Toolbar */}
            <div className="sticky top-0 z-10 bg-[#162125] border-b border-gray-200 px-4 py-2 shadow-sm">
                <div className="container mx-auto flex items-center space-x-1 overflow-x-auto">
                    {/* Menu déroulant pour les polices */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFontPicker(!showFontPicker)}
                            className="text-sm border rounded px-2 py-1 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[120px] text-left">
                            {docData.fontFamily}
                        </button>

                        {showFontPicker && (
                            <div className="absolute z-20 mt-1 w-48 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {fontOptions.map((font) => (
                                    <div
                                        key={font}
                                        onClick={() => handleFontChange(font)}
                                        className="px-4 py-2 text-sm hover:bg-gray-800 cursor-pointer"
                                        style={{ fontFamily: font }}>
                                        {font}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Menu déroulant pour la taille de police */}
                    <select
                        value={docData.fontSize}
                        onChange={(e) => handleFontSizeChange(e.target.value)}
                        className="text-sm border rounded px-2 py-1 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        {fontSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size.replace('px', '')}
                            </option>
                        ))}
                    </select>

                    <div className="border-l border-gray-300 h-6 mx-2"></div>

                    {/* Suggestions de style IA */}
                    <button
                        onClick={getStyleSuggestions}
                        disabled={isAILoading}
                        className={`px-2 py-1 rounded hover:bg-gray-100 flex items-center ${
                            isAILoading ? 'opacity-50' : ''
                        } text-red-600 border border-red-600`}>
                        {isAILoading ? (
                            <HiOutlineLightBulb size={20} />
                        ) : (
                            <>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                    />
                                </svg>
                                <span className="ml-1 text-sm">Style IA</span>
                            </>
                        )}
                    </button>

                    <div className="border-l border-gray-300 h-6 mx-1"></div>

                    {/* Ton du document */}
                    <select
                        value={docData.tone}
                        onChange={async (e) => {
                            const newTone = e.target.value;
                            setDocData((prev) => ({
                                ...prev,
                                tone: newTone,
                            }));

                            // Appel API IA pour appliquer le style au changement de ton
                            setIsAILoading(true);
                            try {
                                const allText =
                                    docData.elements
                                        .filter((el) => el.type === 'text')
                                        .map((el) => el.content || '')
                                        .join(' ') || docData.content;

                                const response = await fetch(
                                    '/api/ai-apply-tone-style',
                                    {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            content: allText,
                                            tone: newTone,
                                        }),
                                    }
                                );

                                if (!response.ok)
                                    throw new Error(
                                        "Échec de l'application du style"
                                    );

                                const data = await response.json();
                                setDocData((prev) => ({
                                    ...prev,
                                    style: data.css,
                                    elements: prev.elements.map((el) =>
                                        el.type === 'text'
                                            ? {
                                                  ...el,
                                                  customStyle: data.css,
                                              }
                                            : el
                                    ),
                                }));
                                toast.success(
                                    `Style ${newTone} appliqué automatiquement`
                                );
                            } catch (error) {
                                console.error(error);
                                toast.error(
                                    "Erreur lors de l'application du style"
                                );
                            } finally {
                                setIsAILoading(false);
                            }
                        }}
                        className="text-sm border rounded px-2 py-1 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        {toneOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Boutons de formatage de texte */}
                    <button
                        onClick={() => document.execCommand('bold', false)}
                        className="p-2 rounded hover:bg-gray-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </button>

                    <button
                        onClick={() => document.execCommand('italic', false)}
                        className="p-2 rounded hover:bg-gray-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        </svg>
                    </button>

                    <button
                        onClick={() => document.execCommand('underline', false)}
                        className="p-2 rounded hover:bg-gray-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 17h1a2 2 0 002-2v-5a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2h1m8-4v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                    </button>

                    <button
                        onClick={() =>
                            document.execCommand('strikeThrough', false)
                        }
                        className="p-2 rounded hover:bg-gray-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 12h14"
                            />
                        </svg>
                    </button>

                    <div className="border-l border-gray-300 h-6 mx-1"></div>

                    {/* Couleur du texte */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setCurrentColorType('text');
                                setShowColorPicker(!showColorPicker);
                            }}
                            className="p-2 rounded hover:bg-gray-100 flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                />
                            </svg>
                            <div
                                className="w-4 h-1 ml-1"
                                style={{
                                    backgroundColor: docData.textColor,
                                }}></div>
                        </button>
                    </div>

                    {/* Couleur de fond */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setCurrentColorType('background');
                                setShowColorPicker(!showColorPicker);
                            }}
                            className="p-2 rounded hover:bg-gray-100 flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                            <div
                                className="w-4 h-4 ml-1 border border-gray-300"
                                style={{
                                    backgroundColor: docData.backgroundColor,
                                }}></div>
                        </button>
                    </div>

                    {showColorPicker && (
                        <div className="absolute z-20 mt-10 bg-white p-2 rounded shadow-lg border border-gray-200 grid grid-cols-10 gap-1 w-64">
                            {colorPalette.map((color) => (
                                <div
                                    key={color}
                                    onClick={() => handleColorChange(color)}
                                    className="w-5 h-5 cursor-pointer hover:border hover:border-gray-400"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                            <div className="col-span-10 mt-2">
                                <input
                                    type="color"
                                    value={
                                        currentColorType === 'text'
                                            ? docData.textColor
                                            : docData.backgroundColor
                                    }
                                    onChange={(e) =>
                                        handleColorChange(e.target.value)
                                    }
                                    className="w-full"
                                />
                            </div>
                        </div>
                    )}

                    <div className="border-l border-gray-300 h-6 mx-1"></div>

                    {/* Alignement du texte */}
                    {textAlignOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleTextAlign(option.value)}
                            className={`p-2 rounded hover:bg-gray-100 ${
                                docData.textAlign === option.value
                                    ? 'bg-gray-100'
                                    : ''
                            }`}>
                            <option.icon className="text-[#f6a262]" />
                        </button>
                    ))}

                    <div className="border-l border-gray-300 h-6 mx-1"></div>

                    {/* Interligne */}
                    <select
                        value={docData.lineHeight}
                        onChange={(e) => handleLineHeightChange(e.target.value)}
                        className="text-sm border rounded px-2 py-1 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        {lineHeightOptions.map((height) => (
                            <option key={height} value={height}>
                                Interligne: {height}
                            </option>
                        ))}
                    </select>

                    <div className="border-l border-gray-300 h-6 mx-1"></div>

                    {/* Format de paragraphe */}
                    <select
                        value={docData.format}
                        onChange={(e) => handleFormatChange(e.target.value)}
                        className="text-sm border rounded px-2 py-1 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        {formatOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <div className="border-l border-gray-300 h-6 mx-1"></div>

                    {/* Insertion d'éléments */}
                    <div className="relative">
                        <button
                            onClick={() => setShowInsertMenu(!showInsertMenu)}
                            className="p-2 rounded hover:bg-gray-100 flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            <span className="ml-1 text-sm">Insérer</span>
                        </button>

                        {showInsertMenu && (
                            <div className="absolute z-20 mt-1 left-0 bg-white rounded-md shadow-lg py-1 w-48">
                                <button
                                    onClick={triggerFileInput}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Image
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                                        />
                                    </svg>
                                    Tableau
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                        />
                                    </svg>
                                    Lien
                                </button>
                            </div>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />
                    </div>

                    <div className="border-l border-gray-300 h-6 mx-1"></div>
                </div>
            </div>

            {/* PAGE BUILDER TOOLBAR */}
            <div className="container mx-auto flex justify-between px-4 py-2 bg-[#191d1e] border-b">
                <div className="flex gap-4">
                    <button
                        onClick={addTextElement}
                        className="px-3 bg-[#f1caad] text-gray-600 uppercase font-medium rounded flex items-center">
                        <TextCursor size={16} className="mr-1" />{' '}
                        <span>Texte</span>
                    </button>
                    <label className="px-3 py-1 bg-[#f1caad] text-gray-600 uppercase font-medium rounded cursor-pointer flex flex items-center">
                        <ImageIcon size={16} className="mr-1" />{' '}
                        <span>image</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleBuilderImageUpload}
                            className="hidden"
                        />
                    </label>
                    <button
                        onClick={() => setShowGifSearch(true)}
                        className="px-3 py-1 bg-[#f1caad] text-gray-600 uppercase font-medium rounded flex items-center">
                        <ImageIcon size={16} className="mr-1" />{' '}
                        <span>GIF</span>
                    </button>
                </div>

                <div className="flex items-center space-x-2 p-2 bg-transparent border-y-2 ">
                    <p>DESSINS :</p>
                    <button
                        onClick={() => setDrawingMode(!drawingMode)}
                        className={`px-3 py-1 rounded ${
                            drawingMode
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-500'
                        }`}>
                        {drawingMode ? 'Désactiver' : 'Activer'}
                    </button>
                    <label className="flex items-center space-x-1">
                        <span className="text-sm">Couleur :</span>
                        <input
                            type="color"
                            value={drawColor}
                            onChange={(e) => setDrawColor(e.target.value)}
                            disabled={!drawingMode}
                        />
                    </label>
                    <label className="flex items-center space-x-1">
                        <span className="text-sm">Taille :</span>
                        <input
                            type="range"
                            min={1}
                            max={24}
                            value={drawSize}
                            onChange={(e) =>
                                setDrawSize(Number(e.target.value))
                            }
                            disabled={!drawingMode}
                        />
                        <span className="text-xs">{drawSize}px</span>
                    </label>
                    <button
                        onClick={handleClearCanvas}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                        disabled={!drawingMode}>
                        Effacer
                    </button>
                </div>
            </div>

            {/* Toolbar de l'élément sélectionné */}
            {selectedElementIdx !== null && (
                <div className="flex items-center space-x-2 bg-[#13100e] border p-2 rounded mb-2">
                    <span className="text-sm text-gray-50 uppercase">
                        Élément sélectionné :
                    </span>
                    <button
                        onClick={() => rotateSelectedElement(-15)}
                        className="px-2 py-1 bg-gray-400 rounded hover:bg-gray-300">
                        ⟲ -15°
                    </button>
                    <button
                        onClick={() => rotateSelectedElement(15)}
                        className="px-2 py-1 bg-gray-400 rounded hover:bg-gray-300">
                        ⟳ +15°
                    </button>

                    <select
                        value={
                            docData.elements[selectedElementIdx]?.fontSize ||
                            '16px'
                        }
                        onChange={(e) =>
                            changeSelectedElementFontSize(e.target.value)
                        }
                        className="text-xs border rounded px-2 py-1 ">
                        {fontSizeOptions.map((size) => (
                            <option
                                key={size}
                                value={size}
                                className="text-red-800">
                                {size.replace('px', '')}
                            </option>
                        ))}
                    </select>

                    <input
                        type="color"
                        value={
                            docData.elements[selectedElementIdx]?.textColor ||
                            '#000000'
                        }
                        onChange={(e) =>
                            changeSelectedElementTextColor(e.target.value)
                        }
                        title="Couleur du texte"
                    />
                    <input
                        type="color"
                        value={
                            docData.elements[selectedElementIdx]
                                ?.backgroundColor || '#ffffff'
                        }
                        onChange={(e) =>
                            changeSelectedElementBg(e.target.value)
                        }
                        title="Couleur de fond"
                    />
                    <button
                        onClick={() => deleteElement(selectedElementIdx)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        title="Supprimer l'élément">
                        Supprimer
                    </button>
                </div>
            )}

            {/* PAGE BUILDER CANVAS */}
            <div
                className="flex-1 overflow-auto p-8"
                style={{ position: 'relative' }}>
                <div
                    className="relative mx-auto bg-white rounded-lg shadow-sm border border-gray-200"
                    style={{ width: 800, height: 765, minHeight: 400 }}>
                    {/* Drawing Canvas (au-dessus, pointer-events: none si pas en mode dessin) */}
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={765}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            zIndex: 20,
                            pointerEvents: drawingMode ? 'auto' : 'none',
                            background: 'transparent',
                        }}
                        onMouseDown={handleStartDraw}
                        onMouseMove={handleDraw}
                        onMouseUp={handleEndDraw}
                        onMouseLeave={handleEndDraw}
                    />
                    {/* Elements existants */}
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: 800,
                            height: 600,
                            zIndex: 10,
                        }}>
                        {docData.elements.map((el, idx) => (
                            <Rnd
                                key={el.id}
                                size={{
                                    width: el.width,
                                    height: el.height,
                                }}
                                position={{ x: el.x, y: el.y }}
                                onDragStop={(_: any, d: { x: any; y: any }) =>
                                    updateElement(idx, { x: d.x, y: d.y })
                                }
                                onResizeStop={(
                                    _: any,
                                    __: any,
                                    ref: {
                                        style: {
                                            width: string;
                                            height: string;
                                        };
                                    },
                                    delta: any,
                                    position: Partial<BuilderElement>
                                ) =>
                                    updateElement(idx, {
                                        width: parseInt(ref.style.width),
                                        height: parseInt(ref.style.height),
                                        ...position,
                                    })
                                }
                                bounds="parent"
                                minWidth={40}
                                minHeight={30}
                                onClick={() => selectElement(idx)}
                                style={{
                                    zIndex: selectedElementIdx === idx ? 10 : 1,
                                    border:
                                        selectedElementIdx === idx
                                            ? '2px solid #2563eb'
                                            : undefined,
                                    background:
                                        el.backgroundColor || 'transparent',
                                }}>
                                {el.type === 'text' ? (
                                    <textarea
                                        className="w-full h-full border resize-none bg-transparent"
                                        value={el.content}
                                        onChange={(e) =>
                                            updateElement(idx, {
                                                content: e.target.value,
                                            })
                                        }
                                        style={{
                                            fontSize:
                                                el.fontSize || docData.fontSize,
                                            fontFamily:
                                                el.fontFamily ||
                                                docData.fontFamily,
                                            color:
                                                el.textColor ||
                                                docData.textColor,
                                            backgroundColor:
                                                el.backgroundColor ||
                                                'transparent',
                                            fontWeight: 500,
                                            ...(el.customStyle
                                                ? JSON.parse(el.customStyle)
                                                : {}),
                                            transform: el.rotation
                                                ? `rotate(${el.rotation}deg)`
                                                : undefined,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            selectElement(idx);
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={el.src}
                                        alt=""
                                        className="w-full h-full object-contain rounded"
                                        draggable={false}
                                        style={{
                                            pointerEvents: 'none',
                                            background:
                                                el.backgroundColor ||
                                                'transparent',
                                            transform: el.rotation
                                                ? `rotate(${el.rotation}deg)`
                                                : undefined,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            selectElement(idx);
                                        }}
                                    />
                                )}
                            </Rnd>
                        ))}
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <footer className="border-t border-gray-200 text-white px-4 py-2 text-xs bg-[#191d1e] flex justify-between items-center">
                <div>
                    {wordCount} mots • {charCount} caractères
                </div>

                {/* Revenir sur le home Page */}

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => router.push('/')}
                        className="px-3 py-1  text-gray-50 uppercase font-medium rounded flex items-center">
                        <span>Revenir à l'Accueil</span>
                    </button>
                </div>

                <div className="flex items-center space-x-4">
                    <select className="text-xs border-none bg-transparent focus:outline-none">
                        <option>100%</option>
                        <option>75%</option>
                        <option>50%</option>
                    </select>
                </div>
            </footer>

            {/* Share Dialog */}
            {shareUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">
                                Partager le document
                            </h3>
                            <button
                                onClick={() => setShareUrl('')}
                                className="text-gray-500 hover:text-gray-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lien de partage
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm">
                                    {isCopied ? 'Copié!' : 'Copier'}
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShareUrl('')}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Style Suggestions Dialog */}
            {showStyleSuggestions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">
                                Suggestions de style par l'IA
                            </h3>
                            <button
                                onClick={() => setShowStyleSuggestions(false)}
                                className="text-gray-500 hover:text-gray-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {styleSuggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <h4 className="font-medium mb-2">
                                        {suggestion.description}
                                    </h4>
                                    <div
                                        className="mb-3 p-3 border rounded"
                                        style={{
                                            fontFamily: 'sans-serif',
                                            ...JSON.parse(suggestion.css),
                                        }}>
                                        Aperçu du style:{' '}
                                        {docData.elements
                                            .filter((el) => el.type === 'text')
                                            .map((el) => el.content)
                                            .join(' ')
                                            .substring(0, 50) ||
                                            'Votre contenu ici...'}
                                        ...
                                    </div>
                                    <button
                                        onClick={() =>
                                            applyStyle(suggestion.css)
                                        }
                                        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                        Appliquer ce style
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowStyleSuggestions(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* GIF Search Dialog */}
            {showGifSearch && (
                <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-[#191d1e] text-white rounded-lg p-4 max-w-xl w-full">
                        <div className="flex mb-2">
                            <input
                                type="text"
                                value={gifQuery}
                                onChange={(e) => setGifQuery(e.target.value)}
                                placeholder="Rechercher un GIF"
                                className="flex-1 border rounded px-2 py-1"
                            />
                            <button
                                onClick={() => searchGifs(gifQuery)}
                                className="ml-2 px-3 py-1 bg-blue-500 text-white uppercase rounded"
                                disabled={isGifLoading}>
                                {isGifLoading ? 'Recherche...' : 'Rechercher'}
                            </button>
                            <button
                                onClick={() => setShowGifSearch(false)}
                                className="ml-2 px-3 py-1 bg-gray-400 text-neutral-800 uppercase rounded">
                                Fermer
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                            {gifResults.map((url, i) => (
                                <img
                                    key={i}
                                    src={url}
                                    alt="GIF"
                                    className="w-full h-24 object-cover cursor-pointer rounded hover:ring-2 ring-blue-400"
                                    onClick={() => {
                                        addGifElement(url);
                                        setShowGifSearch(false);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Templates de disposition façon Canva */}
            <div className="flex items-center space-x-4 p-4 bg-[#f1caad] border-b">
                <span className="text-sm text-gray-500">
                    Templates de disposition :
                </span>
                {layoutTemplates.map((tpl, i) => (
                    <button
                        key={tpl.name}
                        onClick={() =>
                            setDocData((prev) => ({
                                ...prev,
                                elements: tpl.apply(prev.elements),
                            }))
                        }
                        className="flex flex-col items-center px-2 py-1 rounded hover:bg-blue-100 border border-transparent hover:border-blue-400 transition"
                        title={tpl.name}>
                        {/* Miniature de la disposition */}
                        <div className="relative w-20 h-14 bg-white border rounded shadow-sm mb-1 overflow-hidden">
                            {tpl.preview.map((block, idx) => (
                                <div
                                    key={idx}
                                    className="absolute rounded"
                                    style={{
                                        left: `${block.x}%`,
                                        top: `${block.y}%`,
                                        width: `${block.width}%`,
                                        height: `${block.height}%`,
                                        background: block.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 10,
                                        color: '#222',
                                        fontWeight: 600,
                                        border: '1px solid #ddd',
                                    }}>
                                    {block.label}
                                </div>
                            ))}
                        </div>
                        <span className="text-[11px] text-gray-700">
                            {tpl.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
