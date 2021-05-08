const green = '#60b515';
const errorRed = '#f54f47';
const warningYellow = '#F0EC0D';
const hardStartOrange = '#FF9C32';
const livePurple = '#AD73C8';
const normalBorder = 'rgb(50, 79, 97)';
const selectedBorder = 'white';
const errorBorder = errorRed;
const amber = '#FF9C32';

export let theme = {
    text: {
        font: '400 13.3333px Arial',
        family: 'sans-serif'
    },
    size: {
        height: 700
    },
    colors: {
        light: {
            bg: '#1b2b32',
            border: 'rgb(50, 79, 97)',
            text: 'white',
            hover: '#1b2b32',
            scrollbar: '#1b2b32'
        },
        dark: {
            bg: '#1b2b32',
            border: 'rgb(50, 79, 97)',
            text: 'white',
            hover: '#1b2b32',
            scrollbar: '#1b2b32'
        },
        bg: '#1b2b32',
        border: 'rgb(50, 79, 97)',
        text: 'white',
        hover: '#1b2b32',
        scrollbar: '#1b2b32'
    },
    node: {
        colors: {
            light: {
                bg: '#1b2b32',
                border: 'rgb(50, 79, 97)',
                text: 'white',
                hover: '#1b2b32'
            },
            dark: {
                bg: '#1b2b32',
                border: 'rgb(50, 79, 97)',
                text: 'white',
                hover: '#1b2b32'
            },
            bg: '#1b2b32',
            border: 'rgb(50, 79, 97)',
            text: 'white',
            hover: '#1b2b32'
        },
        image: {
            light: {
                path: 'url("icons/icon_check.svg")'
            },
            dark: {
                path: 'url("icons/icon_check.svg")'
            },
            path: 'url("icons/icon_check.svg")'
        },
        size: {
            radius: 20
        }
    },
    edge: {
        colors: {
            light: {
                bg: '#1b2b32',
                border: 'rgb(50, 79, 97)',
                text: 'white',
                hover: '#1b2b32',
                highlightBorder: '#1b2b32'
            },
            dark: {
                bg: '#1b2b32',
                border: 'rgb(50, 79, 97)',
                text: 'white',
                hover: '#1b2b32',
                highlightBorder: '#1b2b32'
            },
            bg: '#1b2b32',
            border: 'rgb(50, 79, 97)',
            text: 'white',
            hover: '#1b2b32',
            highlightBorder: '#1b2b32'
        },
        size: {
            minlength: 20,
            thickness: 10
        }
    }
};