# ActiveMirrorOS Product Kits

This directory contains ready-to-use kits and templates for building with ActiveMirrorOS.

## Available Kits

### Starter Kit

**Purpose**: Get up and running with ActiveMirrorOS in minutes.

**Contents**:
- Pre-configured setup for common use cases
- Sample conversation templates
- Basic integration examples
- Quick start guide

**Best for**: New users, proof-of-concepts, learning

### Enterprise Kit *(Coming Soon)*

**Purpose**: Production-ready deployment template.

**Contents**:
- Docker configuration
- PostgreSQL setup scripts
- Load balancing configuration
- Monitoring and logging setup
- Security hardening guide
- Backup and recovery procedures

**Best for**: Production deployments, enterprise applications

### Research Kit *(Coming Soon)*

**Purpose**: Tools for studying long-term AI interactions.

**Contents**:
- Data export and analysis scripts
- Conversation pattern analysis tools
- Longitudinal study templates
- Statistical analysis helpers
- Visualization tools

**Best for**: Researchers, academics, interaction studies

## Using a Kit

### 1. Choose Your Kit

Select the kit that matches your use case:
- **Starter Kit**: Learning and prototyping
- **Enterprise Kit**: Production deployment
- **Research Kit**: Academic and research projects

### 2. Copy Template Files

```bash
# Example: Copy starter kit to your project
cp -r products/starter-kit/ my-project/
cd my-project/
```

### 3. Customize Configuration

Edit the provided configuration files for your needs:
- Update database paths
- Adjust memory settings
- Configure identity management
- Set up storage preferences

### 4. Follow Kit Guide

Each kit includes a README with:
- Setup instructions
- Configuration options
- Usage examples
- Best practices

## Kit Structure

Each kit follows this structure:

```
kit-name/
├── README.md           # Kit-specific guide
├── config/             # Configuration templates
│   ├── development.yaml
│   ├── production.yaml
│   └── test.yaml
├── examples/           # Kit-specific examples
├── scripts/            # Setup and utility scripts
└── docs/               # Additional documentation
```

## Creating Your Own Kit

Want to create a custom kit for your use case?

1. **Create directory**: `mkdir products/my-custom-kit`
2. **Add configuration**: Include config files for your setup
3. **Write examples**: Provide usage examples
4. **Document it**: Create a clear README
5. **Share**: Submit a PR to help others!

## Support

- **Issues**: Report problems on GitHub
- **Discussions**: Ask questions and share experiences
- **Documentation**: See main [docs/](../docs/) directory

## Contributing

We welcome kit contributions!

- **New kits**: Submit kits for specific use cases
- **Improvements**: Enhance existing kits
- **Bug fixes**: Report and fix kit issues
- **Documentation**: Improve kit guides

See the main README for contribution guidelines.
