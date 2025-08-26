(function (_Scratch) {
    const { ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime } = _Scratch;

    //qq@Seia070
    translate.setup({
        en: {
            'extensionName': 'Console Pro',
            'extensionDescription': 'Better management of bugs',
            'extensionAuthor': '娅@ccw',
            'createConsole': 'create console with ID [ID]',
            'showConsole': 'show console with ID [ID]',
            'hideConsole': 'hide console with ID [ID]',
            'printToConsole': 'console [ID] print [TEXT]',
            'printColoredText': 'console [ID] print [TEXT] with color [COLOR]',
            'setConsoleTextColor': 'set console [ID] text color to [COLOR]',
            'setConsoleBgColor': 'set console [ID] background color to [COLOR]',
            'setConsoleTitleBarColor': 'set console [ID] title bar color to [COLOR]',
            'setConsoleBorderRadius': 'set console [ID] border radius to [RADIUS]px',
            'setConsoleShadow': 'set console [ID] shadow to [SHADOW]',
            'setConsoleFont': 'set console [ID] font to [FONT] size [SIZE]px',
            'setConsoleBackgroundImage': 'set console [ID] background image to [URL]',
            'setConsoleBlur': 'set console [ID] blur to [VALUE]px',
            'clearConsole': 'clear console with ID [ID]',
            'exportConsole': 'export content of console [ID]',
            'importConsole': 'import content to console [ID] from [CONTENT]',
            'getConsoleContent': 'content of console [ID]',
            'deleteConsole': 'delete console with ID [ID]',
            'listAllConsoles': 'JSON list of all console IDs',
            'getConsoleItem': 'item [INDEX] of console [ID]',
            'deleteConsoleItem': 'delete item [INDEX] from console [ID]',
            'insertConsoleItem': 'insert [TEXT] with color [COLOR] before item [INDEX] in console [ID]',
            'replaceConsoleItem': 'replace item [INDEX] in console [ID] with [TEXT] color [COLOR]',
            'defaultText': 'error',
            'timestampLabel': 'Show timestamp',
            'defaultFont': 'Consolas, monospace',
            'defaultShadow': '0 4px 12px rgba(0,0,0,0.15)',
            'includeTimestamp': 'Include timestamp',
            'notIncludeTimestamp': 'Exclude timestamp'
        },
        zh: {
            'extensionName': '控制台Pro',
            'extensionDescription': '更好的管理bug',
            'extensionAuthor': '娅@ccw',
            'createConsole': '创建ID为[ID]的控制台',
            'showConsole': '显示ID为[ID]的控制台',
            'hideConsole': '隐藏ID为[ID]的控制台',
            'printToConsole': 'ID为[ID]的控制台输出 [TEXT]',
            'printColoredText': 'ID为[ID]的控制台输出[TEXT]颜色[COLOR]',
            'setConsoleTextColor': '设置ID为[ID]的控制台文字颜色[COLOR]',
            'setConsoleBgColor': '设置ID为[ID]的控制台背景颜色[COLOR]',
            'setConsoleTitleBarColor': '设置ID为[ID]的控制台标题栏颜色[COLOR]',
            'setConsoleBorderRadius': '设置ID为[ID]的控制台圆角[RADIUS]px',
            'setConsoleShadow': '设置ID为[ID]的控制台阴影[SHADOW]',
            'setConsoleFont': '设置ID为[ID]的控制台字体[FONT]大小[SIZE]px',
            'setConsoleBackgroundImage': '设置ID为[ID]的控制台背景图片[URL]',
            'setConsoleBlur': '设置ID为[ID]的控制台模糊[VALUE]px',
            'clearConsole': '清空ID为[ID]的控制台',
            'exportConsole': '导出ID为[ID]的控制台内容',
            'importConsole': '导入内容到ID为[ID]的控制台[CONTENT]',
            'getConsoleContent': 'ID为[ID]的控制台内容',
            'deleteConsole': '删除ID为[ID]的控制台',
            'listAllConsoles': '所有控制台ID的JSON列表',
            'getConsoleItem': 'ID为[ID]的控制台第[INDEX]项内容',
            'deleteConsoleItem': '删除ID为[ID]的控制台第[INDEX]项',
            'insertConsoleItem': '在ID为[ID]的控制台第[INDEX]项前插入[TEXT]颜色[COLOR]',
            'replaceConsoleItem': '替换ID为[ID]的控制台第[INDEX]项为[TEXT]颜色[COLOR]',
            'defaultText': 'error',
            'timestampLabel': '显示时间戳',
            'defaultFont': 'Consolas, monospace',
            'defaultShadow': '0 4px 12px rgba(0,0,0,0.15)',
            'includeTimestamp': '包含时间戳',
            'notIncludeTimestamp': '不包含时间戳'
        }
    });

    class ConsoleWindow {
        constructor(id) {
            this.id = id;
            this.name = `Console ${id}`;
            this.window = null;
            this.content = null;
            this.records = [];
            
            this.textColor = '#333333';
            this.bgColor = 'rgba(255, 255, 255, 0.95)';
            this.titleBarColor = '#4a90e2';
            this.borderRadius = '8px';
            this.shadow = '0 4px 12px rgba(0,0,0,0.15)';
            this.fontFamily = 'Consolas, monospace';
            this.fontSize = '13px';
            this.backgroundImage = 'none';
            this.blurValue = '0px';
            
            this.showTimestamp = false;
            
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            this.isResizing = false;
            this.resizeStart = { x: 0, y: 0, width: 0, height: 0 };
            
            this.createWindow();
        }

        createWindow() {
            const idHash = this.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            this.window = document.createElement('div');
            this.window.style.cssText = `
                position: fixed;
                left: ${100 + (idHash % 5) * 50}px;
                top: ${100 + (idHash % 5) * 50}px;
                width: 400px;
                height: 300px;
                background-color: ${this.bgColor};
                background-image: ${this.backgroundImage};
                background-size: cover;
                background-position: center;
                border-radius: ${this.borderRadius};
                box-shadow: ${this.shadow};
                overflow: hidden;
                z-index: 9999;
                display: none;
                transition: opacity 0.2s ease;
                backdrop-filter: blur(${this.blurValue});
            `;

            const titleBar = document.createElement('div');
            titleBar.style.cssText = `
                height: 36px;
                background-color: ${this.titleBarColor};
                color: white;
                padding: 0 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                user-select: none;
                font-size: 14px;
                font-family: ${this.fontFamily};
            `;
            titleBar.textContent = this.name;

            const timestampBtn = document.createElement('span');
            timestampBtn.style.cssText = `
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                background: rgba(255,255,255,0.2);
                cursor: pointer;
                margin-right: 8px;
            `;
            timestampBtn.textContent = translate({ id: 'timestampLabel' });
            timestampBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showTimestamp = !this.showTimestamp;
                timestampBtn.style.background = this.showTimestamp ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)';
                this.updateAllTimestamps();
            });

            const closeBtn = document.createElement('span');
            closeBtn.style.cssText = `
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: rgba(255,255,255,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 16px;
            `;
            closeBtn.textContent = '×';
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hide();
            });

            const controls = document.createElement('div');
            controls.style.display = 'flex';
            controls.appendChild(timestampBtn);
            controls.appendChild(closeBtn);
            titleBar.appendChild(controls);

            this.content = document.createElement('div');
            this.content.style.cssText = `
                height: calc(100% - 36px);
                padding: 10px;
                overflow-y: auto;
                font-size: ${this.fontSize};
                line-height: 1.5;
                font-family: ${this.fontFamily};
            `;
            
            this.content.style.scrollbarWidth = 'thin';
            this.content.style.scrollbarColor = '#ccc transparent';

            const resizeHandle = document.createElement('div');
            resizeHandle.style.cssText = `
                position: absolute;
                right: 0;
                bottom: 0;
                width: 16px;
                height: 16px;
                cursor: nwse-resize;
                background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath fill='%23999' d='M12 12l4 4-4 4-4-4 4-4zm0-8l-4 4-4-4 4-4 4 4z'/%3E%3C/svg%3E") no-repeat bottom right;
            `;

            titleBar.addEventListener('mousedown', (e) => {
                this.isDragging = true;
                const rect = this.window.getBoundingClientRect();
                this.dragOffset.x = e.clientX - rect.left;
                this.dragOffset.y = e.clientY - rect.top;
                this.window.style.zIndex = 10000;
            });

            resizeHandle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                this.isResizing = true;
                this.resizeStart.x = e.clientX;
                this.resizeStart.y = e.clientY;
                this.resizeStart.width = this.window.offsetWidth;
                this.resizeStart.height = this.window.offsetHeight;
                this.window.style.zIndex = 10000;
            });

            const self = this;
            document.addEventListener('mousemove', function moveHandler(e) {
                if (self.isDragging) {
                    requestAnimationFrame(() => {
                        const x = e.clientX - self.dragOffset.x;
                        const y = e.clientY - self.dragOffset.y;
                        self.window.style.left = `${Math.max(0, x)}px`;
                        self.window.style.top = `${Math.max(0, y)}px`;
                    });
                } else if (self.isResizing) {
                    requestAnimationFrame(() => {
                        const width = e.clientX - self.resizeStart.x + self.resizeStart.width;
                        const height = e.clientY - self.resizeStart.y + self.resizeStart.height;
                        if (width > 200 && height > 150) {
                            self.window.style.width = `${width}px`;
                            self.window.style.height = `${height}px`;
                        }
                    });
                }
            });

            document.addEventListener('mouseup', function upHandler() {
                self.isDragging = false;
                self.isResizing = false;
                self.window.style.zIndex = 9999;
            });

            this.window.appendChild(titleBar);
            this.window.appendChild(this.content);
            this.window.appendChild(resizeHandle);
            document.body.appendChild(this.window);
        }

        show() {
            this.window.style.display = 'block';
            setTimeout(() => {
                this.window.style.opacity = '1';
            }, 10);
        }

        hide() {
            this.window.style.opacity = '0';
            setTimeout(() => {
                this.window.style.display = 'none';
            }, 200);
        }

        getCurrentTimestamp() {
            const now = new Date();
            return `[${now.getHours().toString().padStart(2, '0')}:${
                now.getMinutes().toString().padStart(2, '0')}:${
                now.getSeconds().toString().padStart(2, '0')}] `;
        }

        updateAllTimestamps() {
            const lines = this.content.querySelectorAll('div');
            lines.forEach((line, index) => {
                if (this.records[index]) {
                    const timestamp = this.showTimestamp ? this.records[index].timestamp : '';
                    line.textContent = `${timestamp}${this.records[index].text}`;
                }
            });
        }

        print(text, color = this.textColor) {
            const timestamp = this.getCurrentTimestamp();
            const line = document.createElement('div');
            line.style.color = color;
            line.style.margin = '3px 0';
            line.textContent = `${this.showTimestamp ? timestamp : ''}${text}`;
            
            line.style.opacity = '0';
            this.content.appendChild(line);
            setTimeout(() => {
                line.style.transition = 'opacity 0.3s ease';
                line.style.opacity = '1';
            }, 10);
            
            this.records.push({
                text: text,
                color: color,
                timestamp: timestamp,
                time: new Date().toISOString()
            });
            
            this.scrollToBottom();
        }

        scrollToBottom() {
            this.content.scrollTop = this.content.scrollHeight;
        }

        setTextColor(color) {
            this.textColor = color;
        }

        setBackgroundColor(color) {
            this.bgColor = color;
            this.window.style.backgroundColor = color;
        }

        setTitleBarColor(color) {
            this.titleBarColor = color;
            const titleBar = this.window.querySelector('div');
            if (titleBar) {
                titleBar.style.backgroundColor = color;
            }
        }

        setBorderRadius(radius) {
            this.borderRadius = `${radius}px`;
            this.window.style.borderRadius = this.borderRadius;
        }

        setShadow(shadow) {
            this.shadow = shadow;
            this.window.style.boxShadow = shadow;
        }

        setFont(font, size) {
            this.fontFamily = font;
            this.fontSize = `${size}px`;
            
            const titleBar = this.window.querySelector('div');
            if (titleBar) {
                titleBar.style.fontFamily = this.fontFamily;
            }
            
            this.content.style.fontFamily = this.fontFamily;
            this.content.style.fontSize = this.fontSize;
            
            this.refreshContent();
        }

        setBackgroundImage(url) {
            this.backgroundImage = url ? `url("${url}")` : 'none';
            this.window.style.backgroundImage = this.backgroundImage;
        }

        setBlur(value) {
            this.blurValue = `${value}px`;
            this.window.style.backdropFilter = `blur(${this.blurValue})`;
        }

        clear() {
            this.content.style.opacity = '0';
            setTimeout(() => {
                this.content.innerHTML = '';
                this.records = [];
                this.content.style.opacity = '1';
            }, 150);
        }

        exportContent() {
            return JSON.stringify(this.records);
        }

        getContent(includeTimestamp = this.showTimestamp) {
            return this.records.map(item => 
                `${includeTimestamp ? item.timestamp : ''}${item.text}`
            ).join('\n');
        }

        importContent(content) {
            try {
                const data = JSON.parse(content);
                if (Array.isArray(data)) {
                    this.clear();
                    setTimeout(() => {
                        data.forEach(item => {
                            this.print(item.text, item.color);
                        });
                    }, 200);
                }
            } catch (e) {
                this.print('Import failed', '#ff0000');
            }
        }

        destroy() {
            if (this.window && this.window.parentNode) {
                this.window.parentNode.removeChild(this.window);
            }
        }

        getItem(index, includeTimestamp = this.showTimestamp) {
            const idx = index - 1;
            if (idx >= 0 && idx < this.records.length) {
                const timestamp = includeTimestamp ? this.records[idx].timestamp : '';
                return `${timestamp}${this.records[idx].text}`;
            }
            return '';
        }

        deleteItem(index) {
            const idx = index - 1;
            if (idx >= 0 && idx < this.records.length) {
                this.records.splice(idx, 1);
                this.refreshContent();
            }
        }

        insertItem(index, text, color) {
            let idx = index - 1;
            idx = Math.max(0, Math.min(idx, this.records.length));
            
            const timestamp = this.getCurrentTimestamp();
            this.records.splice(idx, 0, {
                text: text,
                color: color,
                timestamp: timestamp,
                time: new Date().toISOString()
            });
            
            this.refreshContent();
        }

        replaceItem(index, text, color) {
            const idx = index - 1;
            if (idx >= 0 && idx < this.records.length) {
                const timestamp = this.getCurrentTimestamp();
                this.records[idx] = {
                    text: text,
                    color: color,
                    timestamp: timestamp,
                    time: new Date().toISOString()
                };
                
                this.refreshContent();
            }
        }

        refreshContent() {
            const scrollPos = this.content.scrollTop;
            this.content.innerHTML = '';
            
            this.records.forEach(record => {
                const line = document.createElement('div');
                line.style.color = record.color;
                line.style.margin = '3px 0';
                line.textContent = `${this.showTimestamp ? record.timestamp : ''}${record.text}`;
                this.content.appendChild(line);
            });
            
            this.content.scrollTop = scrollPos;
        }
    }

    class ConsoleProExtension {
        constructor(_runtime) {
            this._runtime = _runtime;
            this.consoles = {};
            this.author = translate({ id: 'extensionAuthor' });
        }

        createConsole(args) {
            const id = Cast.toString(args.ID);
            if (this.consoles[id]) {
                this.consoles[id].destroy();
            }
            this.consoles[id] = new ConsoleWindow(id);
        }

        showConsole(args) {
            const id = Cast.toString(args.ID);
            if (this.consoles[id]) {
                this.consoles[id].show();
            }
        }

        hideConsole(args) {
            const id = Cast.toString(args.ID);
            if (this.consoles[id]) {
                this.consoles[id].hide();
            }
        }

        printToConsole(args) {
            const id = Cast.toString(args.ID);
            const text = Cast.toString(args.TEXT);
            if (this.consoles[id]) {
                this.consoles[id].print(text);
            }
        }

        printColoredText(args) {
            const id = Cast.toString(args.ID);
            const text = Cast.toString(args.TEXT);
            const color = Cast.toString(args.COLOR);
            if (this.consoles[id]) {
                this.consoles[id].print(text, color);
            }
        }

        getConsoleItem(args) {
            const id = Cast.toString(args.ID);
            const index = Cast.toNumber(args.INDEX);
            const includeTimestamp = Cast.toBoolean(args.INCLUDE_TIMESTAMP);
            if (this.consoles[id]) {
                return this.consoles[id].getItem(index, includeTimestamp);
            }
            return '';
        }

        deleteConsoleItem(args) {
            const id = Cast.toString(args.ID);
            const index = Cast.toNumber(args.INDEX);
            if (this.consoles[id]) {
                this.consoles[id].deleteItem(index);
            }
        }

        insertConsoleItem(args) {
            const id = Cast.toString(args.ID);
            const index = Cast.toNumber(args.INDEX);
            const text = Cast.toString(args.TEXT);
            const color = Cast.toString(args.COLOR);
            if (this.consoles[id]) {
                this.consoles[id].insertItem(index, text, color);
            }
        }

        replaceConsoleItem(args) {
            const id = Cast.toString(args.ID);
            const index = Cast.toNumber(args.INDEX);
            const text = Cast.toString(args.TEXT);
            const color = Cast.toString(args.COLOR);
            if (this.consoles[id]) {
                this.consoles[id].replaceItem(index, text, color);
            }
        }

        setConsoleTextColor(args) {
            const id = Cast.toString(args.ID);
            const color = Cast.toString(args.COLOR);
            if (this.consoles[id]) {
                this.consoles[id].setTextColor(color);
            }
        }

        setConsoleBgColor(args) {
            const id = Cast.toString(args.ID);
            const color = Cast.toString(args.COLOR);
            if (this.consoles[id]) {
                this.consoles[id].setBackgroundColor(color);
            }
        }

        setConsoleTitleBarColor(args) {
            const id = Cast.toString(args.ID);
            const color = Cast.toString(args.COLOR);
            if (this.consoles[id]) {
                this.consoles[id].setTitleBarColor(color);
            }
        }

        setConsoleBorderRadius(args) {
            const id = Cast.toString(args.ID);
            const radius = Cast.toNumber(args.RADIUS);
            if (this.consoles[id]) {
                this.consoles[id].setBorderRadius(radius);
            }
        }

        setConsoleShadow(args) {
            const id = Cast.toString(args.ID);
            const shadow = Cast.toString(args.SHADOW);
            if (this.consoles[id]) {
                this.consoles[id].setShadow(shadow);
            }
        }

        setConsoleFont(args) {
            const id = Cast.toString(args.ID);
            const font = Cast.toString(args.FONT);
            const size = Cast.toNumber(args.SIZE);
            if (this.consoles[id]) {
                this.consoles[id].setFont(font, size);
            }
        }

        setConsoleBackgroundImage(args) {
            const id = Cast.toString(args.ID);
            const url = Cast.toString(args.URL);
            if (this.consoles[id]) {
                this.consoles[id].setBackgroundImage(url);
            }
        }

        setConsoleBlur(args) {
            const id = Cast.toString(args.ID);
            const value = Cast.toNumber(args.VALUE);
            if (this.consoles[id]) {
                this.consoles[id].setBlur(value);
            }
        }

        clearConsole(args) {
            const id = Cast.toString(args.ID);
            if (this.consoles[id]) {
                this.consoles[id].clear();
            }
        }

        exportConsole(args) {
            const id = Cast.toString(args.ID);
            if (this.consoles[id]) {
                return this.consoles[id].exportContent();
            }
            return '';
        }

        getConsoleContent(args) {
            const id = Cast.toString(args.ID);
            const includeTimestamp = Cast.toBoolean(args.INCLUDE_TIMESTAMP);
            if (this.consoles[id]) {
                return this.consoles[id].getContent(includeTimestamp);
            }
            return '';
        }

        importConsole(args) {
            const id = Cast.toString(args.ID);
            const content = Cast.toString(args.CONTENT);
            if (this.consoles[id]) {
                this.consoles[id].importContent(content);
            }
        }

        deleteConsole(args) {
            const id = Cast.toString(args.ID);
            if (this.consoles[id]) {
                this.consoles[id].destroy();
                delete this.consoles[id];
            }
        }

        listAllConsoles() {
            return JSON.stringify(
                Object.values(this.consoles).map(console => console.id)
            );
        }

        getInfo() {
            const iconDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFUAAABVCAYAAAA49ahaAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAJsSURBVHic7ZrRdZwwEEVHOSlgS9gS4g62hLgEV5B0YHfgEjipICWwHXg7WHfgEl4+gs/BeASSmEEr/O4nSDPDRQgEiBBCCCGEEEIIIYQQQgghhBCyLcEqEICjiPwVkR9WMTfmLCIPIYTXtYEspfYicrKKV4lLCOFubRBLqbCKVZMQwmon3ywKIR+hVAe+ewa3uJQ88ZqyOFIdoFQHKNUBSnWgOakATvjMG4BD7drMUQ7U5c4KoFdS9YWxNqm5mC0KBHAYRuWUU2G8/UnF/5cwOTl+KWneIm0XpwMvqdXm1EFoD6DL6PZT2fZHid2JyEvuSbs5cs46gCOA66jpotjh0tc4Tdp1o33XObFeI9WM1AIVoUliATwqfa6TNp3WJiZ2F1JnhL4ffHQejPR7yoh9LKm5KksFlhz0qK/2bApMTkJujqalrhE69H9W+qnPpjm5mpW6VugQQ3s2/T3TPilnk1KNhBYtS1Nytyq1j2wHEldBkRhJy1LE52IAOLcqde1cWrwsTcndpNRh+5q7fvKydNJvv3PqaF+RWOiX/vNCHfu/+4/25z5DJi1LV+ZoW+rQJmcUPWptZvIfcoSm1lyV1AJnxHaTdlqbp4UaulShOTVXI6dARexUaNKyNBJ7LDYqNLfmKuQWOBL76e0UMpalkdjdktCSmjenpMDYyEPmsjQS4+hR86ZYFYgNv5Z+Jam9Eqroa2lCrv1LhfHX0oR8LlJdf/pt8a8//vR7o1CqA5TqAKU64Pp7+s09omwER6oDlOqApdSLYaxanC2CWEq9F6OiKnERkYfaRRBCCCGEEEIIIYQQQgghhBBSwj8Fbsx8CrCsDAAAAABJRU5ErkJggg==';
            
            return {
                id: 'consolePro',
                name: translate({ id: 'extensionName' }),
                description: translate({ id: 'extensionDescription' }),
                author: this.author,
                color1: '#4a90e2',
                color2: '#3073b5',
                blockIconURI: iconDataURL,
                menuIconURI: iconDataURL,
                blocks: [
                    {
                        opcode: 'createConsole',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'createConsole' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            }
                        }
                    },
                    {
                        opcode: 'showConsole',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'showConsole' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            }
                        }
                    },
                    {
                        opcode: 'hideConsole',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'hideConsole' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            }
                        }
                    },
                    {
                        opcode: 'printToConsole',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'printToConsole' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            },
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({ id: 'defaultText' })
                            }
                        }
                    },
                    {
                        opcode: 'printColoredText',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'printColoredText' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            },
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({ id: 'defaultText' })
                            },
                            COLOR: {
                                type: ArgumentType.COLOR,
                                defaultValue: '#ff0000'
                            }
                        }
                    },
                    {
                        opcode: 'getConsoleItem',
                        blockType: BlockType.REPORTER,
                        text: translate({ id: 'getConsoleItem' }) + ' [INCLUDE_TIMESTAMP]',
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            },
                            INDEX: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            INCLUDE_TIMESTAMP: {
                                type: ArgumentType.BOOLEAN,
                                defaultValue: false,
                                menu: 'INCLUDE_TIMESTAMP_MENU'
                            }
                        }
                    },
                    {
                        opcode: 'deleteConsoleItem',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'deleteConsoleItem' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            },
                            INDEX: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'insertConsoleItem',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'insertConsoleItem' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            },
                            INDEX: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({ id: 'defaultText' })
                            },
                            COLOR: {
                                type: ArgumentType.COLOR,
                                defaultValue: '#333333'
                            }
                        }
                    },
                    {
                        opcode: 'replaceConsoleItem',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'replaceConsoleItem' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            },
                            INDEX: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({ id: 'defaultText' })
                            },
                            COLOR: {
                                type: ArgumentType.COLOR,
                                defaultValue: '#333333'
                            }
                        }
                    },
                    {
                        opcode: 'setConsoleTextColor',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'setConsoleTextColor' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            },
                            COLOR: {
                                type: ArgumentType.COLOR,
                                defaultValue: '#333333'
                            }
                        }
                    },
                    {
                        opcode: 'setConsoleBgColor',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'setConsoleBgColor' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            },
                            COLOR: {
                                type: ArgumentType.COLOR,
                                defaultValue: '#ffffff'
                            }
                        }
                    },
                    {
                        opcode: 'setConsoleTitleBarColor',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'setConsoleTitleBarColor' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            },
                            COLOR: {
                                type: ArgumentType.COLOR,
                                defaultValue: '#4a90e2'
                            }
                        }
                    },
                    {
                        opcode: 'setConsoleBorderRadius',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'setConsoleBorderRadius' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            },
                            RADIUS: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 8
                            }
                        }
                    },
                    {
                        opcode: 'setConsoleShadow',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'setConsoleShadow' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            },
                            SHADOW: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({ id: 'defaultShadow' })
                            }
                        }
                    },
                    {
                        opcode: 'setConsoleFont',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'setConsoleFont' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            },
                            FONT: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({ id: 'defaultFont' })
                            },
                            SIZE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 13
                            }
                        }
                    },
                    {
                        opcode: 'setConsoleBackgroundImage',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'setConsoleBackgroundImage' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            },
                            URL: {
                                type: ArgumentType.STRING,
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'setConsoleBlur',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'setConsoleBlur' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            },
                            VALUE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'clearConsole',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'clearConsole' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            }
                        }
                    },
                    {
                        opcode: 'exportConsole',
                        blockType: BlockType.REPORTER,
                        text: translate({ id: 'exportConsole' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            }
                        }
                    },
                    {
                        opcode: 'getConsoleContent',
                        blockType: BlockType.REPORTER,
                        text: translate({ id: 'getConsoleContent' }) + ' [INCLUDE_TIMESTAMP]',
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            },
                            INCLUDE_TIMESTAMP: {
                                type: ArgumentType.BOOLEAN,
                                defaultValue: false,
                                menu: 'INCLUDE_TIMESTAMP_MENU'
                            }
                        }
                    },
                    {
                        opcode: 'importConsole',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'importConsole' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            },
                            CONTENT: {
                                type: ArgumentType.STRING,
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'deleteConsole',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'deleteConsole' }),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'default'
                            }
                        }
                    },
                    {
                        opcode: 'listAllConsoles',
                        blockType: BlockType.REPORTER,
                        text: translate({ id: 'listAllConsoles' })
                    }
                ],
                menus: {
                    INCLUDE_TIMESTAMP_MENU: {
                        items: [
                            { text: translate({ id: 'includeTimestamp' }), value: true },
                            { text: translate({ id: 'notIncludeTimestamp' }), value: false }
                        ]
                    }
                }
            };
        }
    }

    extensions.register(new ConsoleProExtension(runtime));
})(Scratch);