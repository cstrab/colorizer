import React from 'react';
import { Button, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ColorSelect } from './ColorSelect';
import { rgbaToHex } from '../utils/utils';
import axios from 'axios';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const apiPrefix = '/api';

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: 'grey',
            },
          },
        },
      },
    },
  },
});

interface ColorMapping {
    initialColor: string;
    targetColor: string;
}

export const ColorizeForm: React.FC = () => {
    const [inputZIPFile, setInputZIPFile] = React.useState<File | null>(null);
    const [colorExtension, setColorExtension] = React.useState<string>('');
    const [colorMappings, setColorMappings] = React.useState<ColorMapping[]>([]);

    const handleInputZIPFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setInputZIPFile(file);
    };

    const handleColorMappingChange = (index: number, field: keyof ColorMapping, value: string) => {
        setColorMappings(prevMappings => {
            const updatedMappings = [...prevMappings];
            updatedMappings[index] = {
                ...updatedMappings[index],
                [field]: value,
            };
            return updatedMappings;
        });
    };

    const handleAddColorMapping = () => {
        setColorMappings(prevMappings => [
            ...prevMappings,
            { initialColor: '', targetColor: '' },
        ]);
    };

    const handleRemoveColorMapping = (index: number) => {
        setColorMappings(prevMappings => {
            const updatedMappings = [...prevMappings];
            updatedMappings.splice(index, 1);
            return updatedMappings;
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        if (inputZIPFile) {
            const formData = new FormData();
            formData.append('file', inputZIPFile);
            formData.append('color_extension', colorExtension);
    
            const transformedColorMappings = colorMappings.map(mapping => ({
                initial_color: mapping.initialColor,
                target_color: mapping.targetColor
            }));
    
            formData.append('color_mapping', JSON.stringify(transformedColorMappings));
    
            try {
                const response = await axios.post(`${apiPrefix}/colorize`, formData, {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
                if (response.status === 200) {
                    const filename = (inputZIPFile?.name?.replace('.zip', '') + colorExtension) + '.zip';
                    const url = URL.createObjectURL(new Blob([response.data]));
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                    URL.revokeObjectURL(url);
                } else {
                    console.error('Failed to send colorization request:', response.data);
                }
            } catch (error) {
                console.error('Error sending colorization request:', error);
            }
        } else {
            window.alert('No file selected');
            console.error('No file selected');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{ textAlign: 'center' }}>
                        Select File:
                        <input type="file" onChange={handleInputZIPFileChange} style={{ display: 'block', marginTop: '10px' }} />
                    </label>
                    <br />
                    <label style={{ textAlign: 'center' }}>
                        Color Extension:
                        <br />
                        <TextField
                            value={colorExtension}
                            onChange={(e) => setColorExtension(e.target.value)}
                            sx={{ 
                                marginTop: '10px', 
                                marginBottom: '0px', 
                                width: '100px',
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'grey',
                                    },
                                },
                            }}
                            size="small"
                            placeholder="i.e. -a, -b"
                        />
                    </label>
                    <br />
                    <label style={{ textAlign: 'center', marginBottom: '10px' }}>
                        Mappings:
                    </label>
                    {colorMappings.map((_mapping, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <label style={{ textAlign: 'center', marginRight: '20px' }}>
                                Initial Color:
                                <div style={{ display: 'block', marginTop: '10px', marginBottom: '5px', width: '225px' }}>
                                    <ColorSelect
                                        initialColor={{ r: 0, g: 0, b: 0, a: 1 }}
                                        onChange={color => handleColorMappingChange(index, 'initialColor', rgbaToHex(color.r, color.g, color.b, color.a))}
                                    />
                                </div>
                            </label>
                            <label style={{ textAlign: 'center' }}>
                                Target Color:
                                <div style={{ display: 'block', marginTop: '10px', marginBottom: '5px', width: '150px' }}>
                                    <ColorSelect
                                        initialColor={{ r: 0, g: 0, b: 0, a: 1 }}
                                        onChange={color => handleColorMappingChange(index, 'targetColor', rgbaToHex(color.r, color.g, color.b, color.a))}
                                    />
                                </div>
                            </label>
                            <IconButton 
                                onClick={() => handleRemoveColorMapping(index)} 
                                size="small" 
                                sx={{ marginLeft: '10px' }}
                                color="default"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    ))}
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddColorMapping}
                        sx={{ marginBottom: '20px' }}
                        color="inherit"
                    >
                        Add Mapping
                    </Button>
                    <Button 
                        variant="contained" 
                        type="submit" 
                        sx={{ 
                            backgroundColor: '#424242', 
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#616161',
                            },
                        }}
                    >
                        Colorize
                    </Button>
                </form>
            </div>
        </ThemeProvider>
    );
};