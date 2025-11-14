# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| 0.1.x   | :x:                |

## Security Features

ActiveMirrorOS implements the following security measures:

### Encryption
- **Vault Memory**: AES-256-GCM encryption for sensitive data
- **Key Derivation**: PBKDF2HMAC with 100,000 iterations
- **Unique IVs**: Each encryption operation uses a unique initialization vector

### Data Storage
- **Local-First**: All data stored locally by default (no cloud transmission)
- **SQLite**: Uses WAL mode for data integrity
- **No Telemetry**: No data collection or phone-home functionality

### Privacy
- **No External Dependencies**: Core functionality works without external APIs
- **User Control**: Users control where and how data is stored
- **Open Source**: All code is auditable

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

### How to Report

If you discover a security vulnerability in ActiveMirrorOS:

1. **Email**: Send details to security@mirrordna.org (or create a private security advisory on GitHub)
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)
3. **Wait**: We aim to respond within 48 hours

### What to Expect

1. **Acknowledgment**: We'll confirm receipt of your report within 48 hours
2. **Assessment**: We'll assess the vulnerability and its impact
3. **Communication**: We'll keep you updated on our progress
4. **Fix & Disclosure**: We'll work on a fix and coordinate disclosure
5. **Credit**: We'll credit you in the security advisory (unless you prefer to remain anonymous)

### Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: Within 7 days
  - High: Within 30 days
  - Medium: Within 90 days
  - Low: Next planned release

## Security Best Practices

### For Users

**Vault Password Management**:
- Use strong, unique passwords for vault encryption
- Do not hardcode passwords in code
- Consider using environment variables or secure key management

**Data Storage**:
- Secure file permissions on database files (600 or 640)
- Encrypt filesystems containing sensitive data
- Regular backups of important sessions

**Dependencies**:
- Keep ActiveMirrorOS updated to latest version
- Audit dependencies regularly
- Use virtual environments to isolate installations

### For Developers

**Code Security**:
- Never commit secrets, API keys, or passwords
- Use `.gitignore` to exclude sensitive files
- Review code changes for security implications

**Cryptographic Operations**:
- Always use the provided encryption APIs
- Do not roll your own crypto
- Verify encrypted data integrity

**Input Validation**:
- Validate and sanitize user inputs
- Use parameterized queries for database operations
- Avoid arbitrary code execution

## Known Security Considerations

### Current Limitations

1. **Local Security**: Data security depends on local system security
   - If system is compromised, data may be accessible
   - Users should secure their devices with full-disk encryption

2. **Password Security**: Vault security depends on password strength
   - Weak passwords can be brute-forced
   - No account lockout mechanism (offline attacks possible)

3. **No Network Security**: Currently no encrypted sync
   - Syncing data requires separate secure channel
   - Future versions will add encrypted sync

### Non-Issues

These are NOT security vulnerabilities:

1. **No Cloud Sync**: By design (privacy feature)
2. **Local Storage**: By design (privacy feature)
3. **No Authentication**: This is a library, not a service
4. **SQLite Limitations**: Appropriate for local-first use case

## Security Updates

Security updates are released as:
- **Patch versions** for backwards-compatible security fixes (0.2.1)
- **Minor versions** if security fix requires API changes (0.3.0)

Security advisories are published:
- GitHub Security Advisories
- CHANGELOG.md with [SECURITY] tag
- Release notes

## Vulnerability Disclosure Policy

We follow **coordinated disclosure**:

1. Reporter notifies us privately
2. We confirm and assess the issue
3. We develop and test a fix
4. We prepare a security advisory
5. We release the fix and advisory simultaneously
6. After 90 days (or fix release), full details may be published

## Third-Party Dependencies

We monitor security advisories for:
- Python: cryptography, pyyaml
- JavaScript: Node.js built-in crypto

We aim to update vulnerable dependencies within:
- Critical: 7 days
- High: 30 days
- Other: Next release

## Security Acknowledgments

We thank the following researchers for responsible disclosure:
- (List will be populated as issues are reported and fixed)

## Questions?

For general security questions (not vulnerability reports):
- Open a GitHub Discussion
- Check documentation in [docs/](docs/)

For vulnerability reports:
- Email: security@mirrordna.org

---

**Last Updated**: November 2024
**Version**: 0.2.0
