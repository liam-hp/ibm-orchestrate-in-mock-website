// Function to open help modal
function openHelp() {
    ('Opening help modal');
    const modal = document.getElementById('helpModal');
    modal.classList.remove('hidden');
    
    // Add scroll listener to hide indicator when scrolled to bottom
    const modalContent = modal.querySelector('.help-modal-content');
    const scrollIndicator = modal.querySelector('.scroll-indicator');
    
    modalContent.addEventListener('scroll', function() {
        const isScrolledToBottom = modalContent.scrollHeight - modalContent.scrollTop <= modalContent.clientHeight + 10;
        if (isScrolledToBottom) {
            scrollIndicator.style.display = 'none';
        } else {
            scrollIndicator.style.display = 'flex';
        }
    });
}

// Function to close help modal
function closeHelp() {
    ('Closing help modal');
    const modal = document.getElementById('helpModal');
    modal.classList.add('hidden');
}

// Function to check if both tasks are complete and hide help button
function checkTasksComplete() {
    const pasteScriptBtn = document.getElementById('pasteScriptBtn');
    const mockWebsiteBtn = document.getElementById('mockWebsiteBtn');
    const helpBtn = document.getElementById('helpBtn');
    
    // If both buttons are hidden, hide the help button too
    if (pasteScriptBtn.classList.contains('hidden') && mockWebsiteBtn.classList.contains('hidden')) {
        helpBtn.classList.add('hidden');
        ('Both tasks complete, hiding help button');
    }
}

// Function to open mock website modal
function openMockWebsite() {
    ('Opening mock website modal');
    const modal = document.getElementById('mockWebsiteModal');
    modal.classList.remove('hidden');
    
    // Reset the form state
    document.getElementById('autoMockupForm').style.display = 'none';
    document.getElementById('mockWebsiteCancel').style.display = 'block';
}

// Function to close mock website modal
function closeMockWebsite() {
    ('Closing mock website modal');
    const modal = document.getElementById('mockWebsiteModal');
    modal.classList.add('hidden');
    
    // Clear the form
    document.getElementById('websiteUrl').value = '';
    document.getElementById('apiKey').value = '';
    document.getElementById('downloadScreenshotCheckbox').checked = false;
    
    // Reset form state
    document.getElementById('autoMockupForm').style.display = 'none';
    document.getElementById('mockWebsiteCancel').style.display = 'block';
}

// Function to select manual upload option
function selectManualUpload() {
    ('Manual upload selected');
    
    // Close the modal
    closeMockWebsite();
    
    // Hide only the Mock Website button
    const mockWebsiteBtn = document.getElementById('mockWebsiteBtn');
    mockWebsiteBtn.classList.add('hidden');
    
    // Check if both tasks are complete
    checkTasksComplete();
    
    // Open the file dialog
    document.getElementById('imageUpload').click();
    
    // Set up a timeout to restore button if no file is selected
    setTimeout(() => {
        const fileInput = document.getElementById('imageUpload');
        if (fileInput.files.length === 0) {
            ('No files selected, restoring button');
            mockWebsiteBtn.classList.remove('hidden');
        }
    }, 100);
}

// Function to select auto mockup option
function selectAutoMockup() {
    ('Auto mockup selected');
    
    // Show the auto mockup form
    document.getElementById('autoMockupForm').style.display = 'block';
    document.getElementById('mockWebsiteCancel').style.display = 'none';
    
    // Focus on the URL input
    setTimeout(() => {
        document.getElementById('websiteUrl').focus();
    }, 100);
}

// Function to open paste script modal
function openPasteScript() {
    ('Opening paste script modal');
    const modal = document.getElementById('pasteScriptModal');
    modal.classList.remove('hidden');
    
    // Focus on the textarea
    document.getElementById('scriptInput').focus();
}


// Function to toggle security info visibility
function toggleSecurityInfo() {
    const content = document.getElementById('securityInfoContent');
    const icon = document.getElementById('securityToggleIcon');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    }
}

// Function to download the screenshot
function downloadScreenshot(blob, url) {
    if (!blob) {
        ('No screenshot available to download');
        return;
    }
    
    // Create a download link
    const link = document.createElement('a');
    const blobUrl = URL.createObjectURL(blob);
    
    // Generate filename from URL
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/\./g, '-');
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `screenshot-${hostname}-${timestamp}.jpg`;
    
    link.href = blobUrl;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the blob URL
    URL.revokeObjectURL(blobUrl);
    
    ('Screenshot download initiated:', filename);
}

// Function to download security script
function downloadSecurityScript() {
    ('Downloading security script');
    
    // Create a link element
    const link = document.createElement('a');
    link.href = 'wxO-embed-chat-security-tool.sh';
    link.download = 'wxO-embed-chat-security-tool.sh';
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    ('Security tool download initiated');
}

// Function to close paste script modal
function closePasteScript() {
    ('Closing paste script modal');
    const modal = document.getElementById('pasteScriptModal');
    modal.classList.add('hidden');
    
    // Clear the textarea and checkbox
    document.getElementById('scriptInput').value = '';
    document.getElementById('fullscreenModeCheckbox').checked = false;
}

// Function to apply the pasted script
function applyScript() {
    const scriptInput = document.getElementById('scriptInput').value.trim();
    
    if (!scriptInput) {
        ('No script input provided');
        return;
    }
    
    try {
        // Extract the entire script content (everything between <script> tags)
        const scriptMatch = scriptInput.match(/<script>([\s\S]*?)<\/script>/);
        
        if (!scriptMatch) {
            ('Could not find <script> tags in the pasted content');
            return;
        }
        
        const scriptContent = scriptMatch[1];
        
        // Extract the wxOConfiguration object
        const configMatch = scriptContent.match(/window\.wxOConfiguration\s*=\s*({[\s\S]*?});/);
        
        if (!configMatch) {
            ('Could not find wxOConfiguration in the pasted script');
            return;
        }
        
        // Parse the configuration object
        const configString = configMatch[1];
        let config;
        
        try {
            // Use Function constructor to safely evaluate the object literal
            config = new Function('return ' + configString)();
        } catch (e) {
            ('Error parsing configuration:', e);
            return;
        }
        
        // Extract the important values
        const orchestrationID = config.orchestrationID;
        const hostURL = config.hostURL;
        const deploymentPlatform = config.deploymentPlatform;
        const crn = config.crn;
        const agentId = config.chatOptions?.agentId;
        
        // Validate required fields
        if (!orchestrationID || !hostURL) {
            ('Configuration missing required fields');
            return;
        }
        
        ('Extracted values:');
        ('- orchestrationID:', orchestrationID);
        ('- hostURL:', hostURL);
        ('- deploymentPlatform:', deploymentPlatform);
        ('- crn:', crn);
        ('- agentId:', agentId);
        
        // Check if fullscreen mode is enabled
        const fullscreenCheckbox = document.getElementById('fullscreenModeCheckbox');
        const isFullscreenMode = fullscreenCheckbox && fullscreenCheckbox.checked;
        
        // Create or update the window.wxOConfiguration with extracted values
        window.wxOConfiguration = {
            orchestrationID: orchestrationID,
            hostURL: hostURL,
            rootElementID: 'root',
            deploymentPlatform: deploymentPlatform,
            crn: crn,
            showLauncher: false,
            chatOptions: {
                agentId: agentId
            }
        };
        
        // Add fullscreen layout if checkbox is checked
        if (isFullscreenMode) {
            window.wxOConfiguration.layout = {
                form: 'fullscreen-overlay',
            };
            console.log('Fullscreen mode enabled');
            
            // Hide the image container and add fullscreen class to body
            const imageContainer = document.querySelector('.image-container');
            const body = document.body;
            if (imageContainer) {
                imageContainer.style.display = 'none';
            }
            if (body) {
                body.classList.add('fullscreen-mode');
            }
        } else {
            console.log('Embedded mode (default)');
        }
        
        ('Updated configuration:', window.wxOConfiguration);
        
        // Remove existing wxO chat elements
        const existingRoot = document.getElementById('root');
        if (existingRoot) {
            existingRoot.remove();
        }
        
        // Remove existing wxO scripts
        const existingScripts = document.querySelectorAll('script[src*="wxoLoader.js"]');
        existingScripts.forEach(script => script.remove());
        
        // Create new root element
        const newRoot = document.createElement('div');
        newRoot.id = 'root';
        document.body.appendChild(newRoot);
        
        // Load and initialize the new wxO chat
        const script = document.createElement('script');
        script.src = `${hostURL}/wxochat/wxoLoader.js?embed=true`;
        script.addEventListener('load', function () {
            ('wxoLoader loaded, initializing...');
            if (typeof wxoLoader !== 'undefined') {
                wxoLoader.init();
                ('wxO chat initialized with new configuration');
                
                // Hide the Paste Script button
                const pasteScriptBtn = document.getElementById('pasteScriptBtn');
                if (pasteScriptBtn) {
                    pasteScriptBtn.classList.add('hidden');
                }
                
                // Check if both tasks are complete
                checkTasksComplete();
                
                // Close the modal
                closePasteScript();
                
                ('Script applied successfully, Paste Script button hidden');
            } else {
                ('wxoLoader not found after script load');
            }
        });
        
        script.addEventListener('error', function() {
            ('Error loading wxoLoader.js');
        });
        
        document.head.appendChild(script);
        
    } catch (error) {
        ('Error applying script:', error);
    }
}


// Function to generate mockup
async function generateMockup() {
    const url = document.getElementById('websiteUrl').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();
    
    if (!url || !apiKey) {
        ('URL or API Key missing');
        return;
    }
    
    // Validate URL format
    try {
        new URL(url);
    } catch (e) {
        ('Invalid URL format');
        return;
    }
    
    // Show loading state
    const generateBtn = document.querySelector('#autoMockupForm .generate-btn');
    const originalText = generateBtn.textContent;
    generateBtn.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 8px;"><span class="spinner"></span>Generating...</span>';
    generateBtn.disabled = true;
    
    try {
        // Encode the URL for the API call
        const encodedUrl = encodeURIComponent(url);
        
        // Construct the ScreenshotOne API URL
        const apiUrl = `https://api.screenshotone.com/take?access_key=${apiKey}&url=${encodedUrl}&format=jpg&block_ads=true&block_cookie_banners=true&block_banners_by_heuristics=false&block_trackers=true&delay=0&timeout=60&response_type=by_format&full_page=true&image_quality=80`;
        
        ('Making API call to:', apiUrl);
        ('Original URL:', url);
        ('API Key:', apiKey);
        
        // Make the API call
        const response = await fetch(apiUrl);
        
        ('Response status:', response.status);
        ('Response headers:', response.headers);
        
        if (!response.ok) {
            const errorText = await response.text();
            ('API Error Response:', errorText);
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }
        
        // Get the image blob
        const imageBlob = await response.blob();
        ('Image blob size:', imageBlob.size, 'bytes');
        ('Image blob type:', imageBlob.type);
        
        // Create a URL for the blob
        const imageUrl = URL.createObjectURL(imageBlob);
        ('Created blob URL:', imageUrl);
        
        // Replace the current image with the screenshot
        const container = document.querySelector('.image-container');
        ('Found container:', container);
        
        container.innerHTML = '';
        
        const newImg = document.createElement('img');
        newImg.src = imageUrl;
        newImg.className = 'stacked-image';
        newImg.alt = `Screenshot of ${url}`;
        
        // Add error handling for image loading
        newImg.onload = function() {
            ('Image loaded successfully!');
        };
        
        newImg.onerror = function() {
            ('Failed to load image from blob URL');
        };
        
        container.appendChild(newImg);
        ('Image element added to container');
        
        ('Screenshot generated successfully for:', url);
        
        // Check if download checkbox is checked
        const downloadCheckbox = document.getElementById('downloadScreenshotCheckbox');
        if (downloadCheckbox && downloadCheckbox.checked) {
            ('Auto-downloading screenshot...');
            downloadScreenshot(imageBlob, url);
        }
        
        // Hide only the Mock Website button after successful mockup generation
        const mockWebsiteBtn = document.getElementById('mockWebsiteBtn');
        mockWebsiteBtn.classList.add('hidden');
        
        // Check if both tasks are complete
        checkTasksComplete();
        
        ('Mock Website button hidden after successful mockup generation');
        
        // Close modal
        closeMockWebsite();
        
    } catch (error) {
        ('Error generating screenshot:', error);
    } finally {
        // Reset button
        generateBtn.textContent = originalText;
        generateBtn.disabled = false;
    }
}

// Function to handle mockup API integration (placeholder)
async function fetchMockupImages(url, apiKey) {
    try {
        // This is where you would integrate with your actual mockup API
        // Example API call structure:
        /*
        const response = await fetch('https://your-mockup-api.com/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                url: url,
                options: {
                    format: 'png',
                    quality: 'high',
                    devices: ['desktop', 'tablet', 'mobile']
                }
            })
        });
        
        const data = await response.json();
        
        if (data.success && data.images) {
            // Replace current images with generated mockups
            const container = document.querySelector('.image-container');
            container.innerHTML = '';
            
            data.images.forEach((imageUrl, index) => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.className = 'stacked-image';
                img.alt = `Mockup ${index + 1}`;
                container.appendChild(img);
            });
        }
        */
        
        ('Mockup API integration would happen here');
        ('URL:', url);
        ('API Key:', apiKey);
        
    } catch (error) {
        ('Error generating mockup:', error);
    }
}

// Function to handle image upload
function handleImageUpload(event) {
    const files = event.target.files;
    
    if (files.length === 0) {
        // User cancelled the file dialog, restore controls
        const controls = document.querySelector('.controls');
        controls.classList.remove('hidden');
        ('File dialog cancelled, controls restored');
        return;
    }
    
    // Validate all files are images
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        ('No valid image files selected');
        event.target.value = '';
        return;
    }
    
    // Clear the current image stack
    const container = document.querySelector('.image-container');
    container.innerHTML = '';
    
    // Process images sequentially to maintain order
    processImagesSequentially(imageFiles, container, event);
}

// Function to process images one by one to maintain order
function processImagesSequentially(imageFiles, container, event) {
    let currentIndex = 0;
    
    function processNextImage() {
        if (currentIndex >= imageFiles.length) {
            // All images processed, clear the file input
            event.target.value = '';
            
            // Hide only the Mock Website button after successful upload
            const mockWebsiteBtn = document.getElementById('mockWebsiteBtn');
            mockWebsiteBtn.classList.add('hidden');
            
            // Check if both tasks are complete
            checkTasksComplete();
            
            ('All images uploaded successfully, Mock Website button hidden');
            
            return;
        }
        
        const file = imageFiles[currentIndex];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Create a new image element
            const newImg = document.createElement('img');
            newImg.src = e.target.result;
            newImg.className = 'stacked-image';
            newImg.alt = `Uploaded Image ${currentIndex + 1}`;
            
            // Add the new image to the container
            container.appendChild(newImg);
            
            // Move to next image
            currentIndex++;
            processNextImage();
        };
        
        reader.readAsDataURL(file);
    }
    
    // Start processing
    processNextImage();
}

// Function to handle keyboard navigation
document.addEventListener('keydown', function(event) {
    // Don't trigger shortcuts when typing in input fields or textareas
    const activeElement = document.activeElement;
    const isInputField = activeElement.tagName === 'INPUT' ||
                        activeElement.tagName === 'TEXTAREA' ||
                        activeElement.isContentEditable;
    
    switch(event.key) {
        case 'u':
        case 'U':
            if (!isInputField) {
                event.preventDefault();
                openImageUpload();
            }
            break;
        case 'Escape':
            // Close modals if they're open
            const mockWebsiteModal = document.getElementById('mockWebsiteModal');
            const pasteScriptModal = document.getElementById('pasteScriptModal');
            const helpModal = document.getElementById('helpModal');
            
            if (!mockWebsiteModal.classList.contains('hidden')) {
                closeMockWebsite();
            } else if (!pasteScriptModal.classList.contains('hidden')) {
                closePasteScript();
            } else if (!helpModal.classList.contains('hidden')) {
                closeHelp();
            }
            break;
    }
});

// Function to handle image loading errors and apply stored configuration
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.stacked-image');
    images.forEach(function(img) {
        img.addEventListener('error', function() {
            ('Image failed to load:', this.src);
            this.style.display = 'none';
        });
    });
    
    // Check if there's a stored configuration to apply
    const storedConfig = sessionStorage.getItem('wxOConfiguration');
    if (storedConfig) {
        try {
            const config = JSON.parse(storedConfig);
            ('Applying stored configuration:', config);
            
            // Update the window.wxOConfiguration
            window.wxOConfiguration = config;
            
            // Clear the stored configuration
            sessionStorage.removeItem('wxOConfiguration');
            
            // Reinitialize the wxO chat with new configuration
            if (typeof wxoLoader !== 'undefined') {
                ('Reinitializing wxoLoader with new configuration');
                wxoLoader.init();
            }
        } catch (e) {
            ('Error applying stored configuration:', e);
        }
    }
});
