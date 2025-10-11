#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

interface TemplateConfig {
  template: {
    name: string
    version: string
    description: string
  }
  variables: {
    project: Record<string, string>
    branding: Record<string, string>
    features: Record<string, boolean>
  }
  files: {
    replace: string[]
    remove: string[]
  }
}

interface ClientConfig {
  project: {
    name: string
    description: string
    author: string
    email: string
    githubUsername: string
  }
  branding: {
    companyName: string
    supportEmail: string
    websiteUrl: string
    logoPath: string
    linkedinUsername: string
  }
}

function loadTemplateConfig(): TemplateConfig {
  const configPath = join(process.cwd(), 'template.config.json')
  return JSON.parse(readFileSync(configPath, 'utf-8'))
}

function loadClientConfig(configPath: string): ClientConfig {
  return JSON.parse(readFileSync(configPath, 'utf-8'))
}

function replaceInFile(filePath: string, replacements: Record<string, string>) {
  let content = readFileSync(filePath, 'utf-8')
  
  for (const [placeholder, value] of Object.entries(replacements)) {
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
    content = content.replace(regex, value)
  }
  
  writeFileSync(filePath, content)
}

function getAllFiles(dir: string, extensions: string[] = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md']): string[] {
  const files: string[] = []
  const items = readdirSync(dir)
  
  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)
    
    if (stat.isDirectory()) {
      // Skip node_modules, .git, .next, etc.
      if (!['node_modules', '.git', '.next', 'coverage', 'local.db'].includes(item)) {
        files.push(...getAllFiles(fullPath, extensions))
      }
    } else if (extensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath)
    }
  }
  
  return files
}

function generateReplacements(clientConfig: ClientConfig): Record<string, string> {
  return {
    '{{PROJECT_NAME}}': clientConfig.project.name,
    '{{PROJECT_DESCRIPTION}}': clientConfig.project.description,
    '{{AUTHOR_NAME}}': clientConfig.project.author,
    '{{AUTHOR_EMAIL}}': clientConfig.project.email,
    '{{GITHUB_USERNAME}}': clientConfig.project.githubUsername,
    '{{COMPANY_NAME}}': clientConfig.branding.companyName,
    '{{SUPPORT_EMAIL}}': clientConfig.branding.supportEmail,
    '{{WEBSITE_URL}}': clientConfig.branding.websiteUrl,
    '{{LOGO_PATH}}': clientConfig.branding.logoPath,
    '{{LINKEDIN_USERNAME}}': clientConfig.branding.linkedinUsername,
  }
}

function removeDirectories(directories: string[]) {
  for (const dir of directories) {
    try {
      const { execSync } = require('child_process')
      execSync(`rm -rf ${dir}`, { stdio: 'inherit' })
      console.log(`Removed directory: ${dir}`)
    } catch (error) {
      console.warn(`Could not remove directory ${dir}:`, error)
    }
  }
}

function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log('Usage: node template-generator.js <client-config.json>')
    console.log('Example: node template-generator.js client-config.json')
    process.exit(1)
  }
  
  const clientConfigPath = args[0]
  
  try {
    console.log('🚀 Starting template generation...')
    
    const templateConfig = loadTemplateConfig()
    const clientConfig = loadClientConfig(clientConfigPath)
    const replacements = generateReplacements(clientConfig)
    
    console.log('📁 Processing files...')
    
    // Get all files to process
    const allFiles = getAllFiles(process.cwd())
    
    // Process each file
    for (const file of allFiles) {
      try {
        replaceInFile(file, replacements)
      } catch (error) {
        console.warn(`Could not process file ${file}:`, error)
      }
    }
    
    console.log('🗑️  Removing portfolio-specific directories...')
    removeDirectories(templateConfig.files.remove)
    
    console.log('✅ Template generation completed!')
    console.log(`📦 Generated project: ${clientConfig.project.name}`)
    
  } catch (error) {
    console.error('❌ Error generating template:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { generateReplacements, replaceInFile, getAllFiles }
