import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { publishAllTemplates } from '@nera-static/plugin-utils'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sourceDir = path.resolve(__dirname, '../views/')

describe('Template publishing', () => {
    const testDir = path.resolve(__dirname, '../test-temp')
    const templatesDir = path.join(
        testDir,
        'views/vendor/plugin-simple-page-list'
    )
    const templatePath = path.join(templatesDir, 'simple-page-list.pug')
    let originalCwd

    const publish = (options = {}) =>
        publishAllTemplates({
            pluginName: 'plugin-simple-page-list',
            sourceDir,
            ...options,
        })

    beforeEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true })
        }
        fs.mkdirSync(testDir, { recursive: true })

        // Make the directory look like a real Nera project, which is what
        // validateNeraProject checks for as of plugin-utils 1.2.0 (D4).
        fs.writeFileSync(
            path.join(testDir, 'package.json'),
            JSON.stringify({ name: 'my-site' })
        )
        fs.mkdirSync(path.join(testDir, 'config'), { recursive: true })
        fs.writeFileSync(path.join(testDir, 'config/app.yaml'), 'lang: en\n')
        fs.mkdirSync(path.join(testDir, 'pages'), { recursive: true })

        originalCwd = process.cwd()
        process.chdir(testDir)
    })

    afterEach(() => {
        process.chdir(originalCwd)
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true })
        }
    })

    it('publishes templates to the correct directory', () => {
        expect(publish()).toBe(true)
        expect(fs.existsSync(templatePath)).toBe(true)
    })

    it('skips publishing when templates already exist', () => {
        fs.mkdirSync(templatesDir, { recursive: true })
        fs.writeFileSync(templatePath, 'existing content')

        expect(publish()).toBe(true)
        expect(fs.readFileSync(templatePath, 'utf8')).toBe('existing content')
    })

    it('overwrites existing templates when force is set', () => {
        fs.mkdirSync(templatesDir, { recursive: true })
        fs.writeFileSync(templatePath, 'existing content')

        expect(publish({ force: true })).toBe(true)
        expect(fs.readFileSync(templatePath, 'utf8')).not.toBe(
            'existing content'
        )
        expect(fs.readFileSync(templatePath, 'utf8')).toBe(
            fs.readFileSync(path.join(sourceDir, 'simple-page-list.pug'), 'utf8')
        )
    })

    it('refuses to publish outside a Nera project', () => {
        fs.rmSync(path.join(testDir, 'config/app.yaml'))
        fs.rmSync(path.join(testDir, 'pages'), { recursive: true })

        expect(publish()).toBe(false)
    })
})
